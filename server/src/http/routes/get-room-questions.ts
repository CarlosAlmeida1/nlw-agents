import { desc, eq, and } from 'drizzle-orm'
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schemas/index.ts'

export const getRoomQuestions: FastifyPluginCallbackZod = (app) => {
  // Rota para buscar todas as perguntas de uma sala
  app.get(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(eq(schema.questions.roomId, roomId))
        .orderBy(desc(schema.questions.createdAt))

      return result
    }
  )

  // Rota para buscar uma pergunta específica (útil para verificar se a resposta foi gerada)
  app.get(
    '/rooms/:roomId/questions/:questionId',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
          questionId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId, questionId } = request.params

      const result = await db
        .select({
          id: schema.questions.id,
          question: schema.questions.question,
          answer: schema.questions.answer,
          createdAt: schema.questions.createdAt,
        })
        .from(schema.questions)
        .where(
          and(
            eq(schema.questions.roomId, roomId),
            eq(schema.questions.id, questionId)
          )
        )
        .limit(1)

      const question = result[0]

      if (!question) {
        return reply.status(404).send({ error: 'Question not found' })
      }

      return question
    }
  )
}