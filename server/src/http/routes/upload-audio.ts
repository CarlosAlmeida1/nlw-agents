import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts'
import { recordingSessions } from '../../lib/recording-sessions.ts'
import { schema } from '../../db/schemas/index.ts'

export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { roomId } = request.params
        const session = recordingSessions.get(roomId)
        
        if (session?.status !== 'recording') {
          return reply.status(400).send({ 
            error: 'Gravação não está ativa'
          })
        }

        const audio = await request.file()

        if (!audio) {
          throw new Error('Audio is required.')
        }

        const audioBuffer = await audio.toBuffer()
        const audioAsBase64 = audioBuffer.toString('base64')

        const transcription = await transcribeAudio(audioAsBase64, audio.mimetype)
        const embeddings = await generateEmbeddings(transcription)

        const result = await db
          .insert(schema.audioChunks)
          .values({
            roomId,
            transcription,
            embeddings,
          })
          .returning()

        const chunk = result[0]

        if (!chunk) {
          throw new Error('Erro ao salvar chunk de áudio')
        }

        return reply.status(201).send({ chunkId: chunk.id })
      } catch (error) {
        console.error('Erro ao processar áudio:', error)
        
        if (error instanceof Error && error.message.includes('429')) {
          return reply.status(429).send({ 
            error: 'Limite de requisições da API excedido. Tente novamente em alguns minutos.' 
          })
        } else if (error instanceof Error && error.message.includes('RESOURCE_EXHAUSTED')) {
          return reply.status(429).send({ 
            error: 'Cota da API esgotada. Tente novamente amanhã ou considere fazer upgrade do plano.' 
          })
        }
        
        return reply.status(500).send({ 
          error: 'Erro interno do servidor ao processar o áudio.' 
        })
      }
    }
  )
}