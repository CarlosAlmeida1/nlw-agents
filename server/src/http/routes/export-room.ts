import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { generatePdfExport, generateWordExport } from '../../services/document-generator.ts'

export const exportRoomRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/rooms/:roomId/export/pdf',
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
        
        const pdfBuffer = await generatePdfExport(roomId)
        
        reply.header('Content-Type', 'application/pdf')
        reply.header('Content-Disposition', `attachment; filename="sala-${roomId}.pdf"`)
        
        return reply.send(pdfBuffer)
      } catch (error) {
        console.error('Erro ao gerar PDF:', error)
        
        if (error instanceof Error && error.message.includes('Sala não encontrada')) {
          return reply.status(404).send({ error: 'Sala não encontrada' })
        }
        
        return reply.status(500).send({ 
          error: 'Erro interno do servidor ao gerar PDF.' 
        })
      }
    }
  )

  app.get(
    '/rooms/:roomId/export/word',
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
        
        const wordBuffer = await generateWordExport(roomId)
        
        reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        reply.header('Content-Disposition', `attachment; filename="sala-${roomId}.docx"`)
        
        return reply.send(wordBuffer)
      } catch (error) {
        console.error('Erro ao gerar Word:', error)
        
        if (error instanceof Error && error.message.includes('Sala não encontrada')) {
          return reply.status(404).send({ error: 'Sala não encontrada' })
        }
        
        return reply.status(500).send({ 
          error: 'Erro interno do servidor ao gerar Word.' 
        })
      }
    }
  )
} 