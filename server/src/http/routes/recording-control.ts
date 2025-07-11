import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { recordingSessions } from '../../lib/recording-sessions.ts'

export const recordingControlRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/recording/start',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      
      recordingSessions.set(roomId, {
        status: 'recording',
        startedAt: new Date()
      })
      
      return reply.status(200).send({ 
        status: 'recording',
        message: 'Gravação iniciada'
      })
    }
  )

  app.post(
    '/rooms/:roomId/recording/pause',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      
      recordingSessions.set(roomId, {
        status: 'paused',
        pausedAt: new Date()
      })
      
      return reply.status(200).send({ 
        status: 'paused',
        message: 'Gravação pausada'
      })
    }
  )

  app.post(
    '/rooms/:roomId/recording/resume',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      
      recordingSessions.set(roomId, {
        status: 'recording',
        startedAt: new Date()
      })
      
      return reply.status(200).send({ 
        status: 'recording',
        message: 'Gravação retomada'
      })
    }
  )

  app.post(
    '/rooms/:roomId/recording/stop',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      
      recordingSessions.set(roomId, {
        status: 'stopped'
      })
      
      return reply.status(200).send({ 
        status: 'stopped',
        message: 'Gravação encerrada'
      })
    }
  )

  app.get(
    '/rooms/:roomId/recording/status',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params
      const session = recordingSessions.get(roomId)
      
      return reply.status(200).send({
        status: session?.status || 'stopped',
        session
      })
    }
  )
} 