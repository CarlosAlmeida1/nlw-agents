import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schemas/index.ts'
import { 
  findRelevantTranscriptions, 
  generateAnswer 
} from '../../services/gemini.ts'
import { eq } from 'drizzle-orm'

export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const { question } = request.body

      const result = await db
        .insert(schema.questions)
        .values({
          question,
          roomId,
        })
        .returning()

      const insertedQuestion = result[0]

      if (!insertedQuestion) {
        throw new Error('Failed to create question')
      }

      setImmediate(async () => {
        try {
          const relevantTranscriptions = await findRelevantTranscriptions(
            question,
            roomId,
            5
          )

          if (relevantTranscriptions.length > 0) {
            const answer = await generateAnswer(question, relevantTranscriptions)
            
            await db
              .update(schema.questions)
              .set({ answer })
              .where(eq(schema.questions.id, insertedQuestion.id))
          } else {
            // Se não houver transcrições relevantes, define uma resposta padrão
            await db
              .update(schema.questions)
              .set({ 
                answer: 'Não possuo informações suficientes no conteúdo da aula para responder a essa pergunta.' 
              })
              .where(eq(schema.questions.id, insertedQuestion.id))
          }
        } catch (error) {
          console.error('Erro ao gerar resposta:', error)
          
          let errorMessage = 'Ocorreu um erro ao gerar a resposta. Tente novamente.'
          
          // Verificar se é um erro de rate limiting
          if (error instanceof Error && error.message.includes('429')) {
            errorMessage = 'Limite de requisições da API excedido. Tente novamente em alguns minutos.'
          } else if (error instanceof Error && error.message.includes('RESOURCE_EXHAUSTED')) {
            errorMessage = 'Cota da API esgotada. Tente novamente amanhã ou considere fazer upgrade do plano.'
          }
          
          // Em caso de erro, define uma resposta de erro
          await db
            .update(schema.questions)
            .set({ 
              answer: errorMessage
            })
            .where(eq(schema.questions.id, insertedQuestion.id))
        }
      })

      return reply.status(201).send({ questionId: insertedQuestion.id })
    }
  )
}
