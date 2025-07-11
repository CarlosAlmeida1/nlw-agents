import { GoogleGenAI } from '@google/genai'
import { cosineDistance, desc, eq } from 'drizzle-orm'
import { db } from '../db/connection.ts'
import { schema } from '../db/schemas/index.ts'
import { env } from '../env.ts'

const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
})

const model = 'gemini-2.5-flash'

// Cache para embeddings
const embeddingsCache = new Map<string, number[]>()

// Configuração de retry com backoff
const MAX_RETRIES = 3
const INITIAL_DELAY = 1000 // 1 segundo
const BACKOFF_FACTOR = 2

// Sistema de fila para rate limiting
class ApiQueue {
  private queue: (() => Promise<void>)[] = []
  private processing = false
  private lastCallTime = 0
  private minInterval = 500 // 500ms entre chamadas (aprox 120/min)

  async add<T>(operation: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await operation()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      if (!this.processing) {
        this.process()
      }
    })
  }

  private async process() {
    if (this.processing) return
    this.processing = true

    while (this.queue.length > 0) {
      const operation = this.queue.shift()!
      
      // Garantir intervalo mínimo entre chamadas
      const now = Date.now()
      const timeSinceLastCall = now - this.lastCallTime
      if (timeSinceLastCall < this.minInterval) {
        await sleep(this.minInterval - timeSinceLastCall)
      }
      
      try {
        await operation()
      } catch (error) {
        console.error('Erro na fila de processamento:', error)
      }
      
      this.lastCallTime = Date.now()
    }

    this.processing = false
  }
}

const apiQueue = new ApiQueue()

// Função auxiliar para sleep
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para retry com backoff exponencial
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  initialDelay: number = INITIAL_DELAY
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Se é um erro de rate limit e não é a última tentativa
      if (error instanceof Error && 
          error.message.includes('429') && 
          attempt < maxRetries) {
        const delay = initialDelay * Math.pow(BACKOFF_FACTOR, attempt)
        console.log(`Rate limit atingido. Tentativa ${attempt + 1}/${maxRetries + 1}. Aguardando ${delay}ms...`)
        await sleep(delay)
        continue
      }
      
      // Se não é um erro de rate limit, não faz retry
      if (!(error instanceof Error) || !error.message.includes('429')) {
        throw error
      }
      
      // Se é a última tentativa, lança o erro
      if (attempt === maxRetries) {
        throw error
      }
    }
  }
  
  throw lastError
}

export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await apiQueue.add(async () => {
    return await retryWithBackoff(async () => {
      return await gemini.models.generateContent({
        model,
        contents: [
          {
            text: `
Você é um transcritor profissional de áudios em português do Brasil. Sua tarefa é transcrever fielmente o conteúdo do áudio fornecido, mantendo a naturalidade, clareza e precisão. Siga as orientações abaixo para garantir a melhor qualidade na transcrição:

- Utilize pontuação adequada, incluindo vírgulas, pontos finais, interrogações e exclamações quando necessário.
- Separe o texto em parágrafos sempre que houver mudança de assunto, pausa significativa ou quando for apropriado para facilitar a leitura.
- Não corrija possíveis erros de pronúncia, gírias ou regionalismos; mantenha a autenticidade do falante.
- Não adicione, omita ou interprete informações; apenas transcreva exatamente o que foi dito.
- Caso haja trechos inaudíveis, utilize a marcação [inaudível] no local correspondente.
- Não inclua comentários ou observações pessoais.

Transcreva o áudio a seguir:
            `.trim(),
          },
          {
            inlineData: {
              mimeType,
              data: audioAsBase64,
            },
          },
        ],
      })
    })
  })

  if (!response.text) {
    throw new Error('Não foi possível converter o áudio')
  }

  return response.text
}

export async function generateEmbeddings(text: string) {
  // Verificar se já existe no cache
  const cacheKey = text.trim().toLowerCase()
  if (embeddingsCache.has(cacheKey)) {
    console.log('Usando embedding do cache')
    return embeddingsCache.get(cacheKey)!
  }

  const response = await apiQueue.add(async () => {
    return await retryWithBackoff(async () => {
      return await gemini.models.embedContent({
        model: 'text-embedding-004',
        contents: [{ text }],
        config: {
          taskType: 'RETRIEVAL_DOCUMENT',
        },
      })
    })
  })

  if (!response.embeddings?.[0].values) {
    throw new Error('Não foi possível gerar os embeddings.')
  }

  const embeddings = response.embeddings[0].values
  embeddingsCache.set(cacheKey, embeddings)
  
  return embeddings
}

export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  // Se não houver transcrições relevantes, a IA deve responder com base no seu conhecimento geral sobre o contexto da pergunta.
  let context = transcriptions.join('\n\n')
  let prompt = ''

  if (transcriptions.length === 0) {
    prompt = `
Você é um assistente especializado em responder perguntas sobre conteúdos de aulas, em português do Brasil. Não há transcrições disponíveis do conteúdo da aula para esta pergunta. Responda com base no seu conhecimento geral sobre o tema da pergunta, deixando claro que está utilizando seu conhecimento próprio e não informações específicas da aula. Seja claro, objetivo e cordial. Estruture a resposta em parágrafos curtos para facilitar a leitura.

PERGUNTA:
${question}
    `.trim()
  } else {
    prompt = `
Você é um assistente especializado em responder perguntas com base em conteúdos de aulas transcritas em português do Brasil. Siga rigorosamente as instruções abaixo para fornecer respostas de alta qualidade:

- Utilize exclusivamente as informações presentes no CONTEXTO fornecido.
- Caso a resposta não esteja presente no contexto, responda com base no seu conhecimento geral sobre o tema, deixando claro que está utilizando seu conhecimento próprio e não informações específicas da aula.
- Seja claro, objetivo e direto ao ponto.
- Mantenha um tom educativo, profissional e cordial.
- Sempre que possível, cite trechos relevantes do contexto utilizando a expressão "conteúdo da aula", por exemplo: "Segundo o conteúdo da aula, ...".
- Não invente, extrapole ou suponha informações que não estejam explicitamente no contexto, a menos que seja necessário para complementar a resposta com seu conhecimento geral.
- Estruture a resposta em parágrafos curtos para facilitar a leitura.

CONTEXTO:
${context}

PERGUNTA:
${question}
    `.trim()
  }

  const response = await apiQueue.add(async () => {
    return await retryWithBackoff(async () => {
      return await gemini.models.generateContent({
        model,
        contents: [
          {
            text: prompt,
          },
        ],
      })
    })
  })

  if (!response.text) {
    throw new Error('Falha ao gerar resposta pelo Gemini')
  }

  return response.text
}

export async function findRelevantTranscriptions(
  question: string,
  roomId: string,
  limit: number = 10
): Promise<string[]> {
  const questionEmbeddings = await generateEmbeddings(question)
  
  const relevantChunks = await db
    .select({
      transcription: schema.audioChunks.transcription,
      similarity: cosineDistance(schema.audioChunks.embeddings, questionEmbeddings),
    })
    .from(schema.audioChunks)
    .where(eq(schema.audioChunks.roomId, roomId))
    .orderBy(desc(cosineDistance(schema.audioChunks.embeddings, questionEmbeddings)))
    .limit(limit)
  
  const relevantTranscriptions = relevantChunks
    .filter(chunk => (chunk.similarity as number) > 0.2)
    .map(chunk => chunk.transcription)
  
  // Agora sempre retorna o array (pode ser vazio)
  return relevantTranscriptions
}