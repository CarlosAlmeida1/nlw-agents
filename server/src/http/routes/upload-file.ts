import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import { db } from '../../db/connection.ts'
import { schema } from '../../db/schemas/index.ts'
import { processFile } from '../../services/file-processor.ts'
import { generateEmbeddings } from '../../services/gemini.ts'
import { eq } from 'drizzle-orm'
import { unlinkSync, writeFileSync } from 'fs'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

export const uploadFileRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/upload-file',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      let tempFilePath: string | null = null
      
      try {
        const { roomId } = request.params
        const file = await request.file()

        if (!file) {
          return reply.status(400).send({ error: 'Arquivo é obrigatório' })
        }

        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain'
        ]

        if (!allowedTypes.includes(file.mimetype)) {
          return reply.status(400).send({ 
            error: 'Tipo de arquivo não suportado. Apenas Word (.docx) e texto (.txt) são permitidos no momento.' 
          })
        }

        tempFilePath = `/tmp/${Date.now()}-${file.filename}`
        
        await pipeline(file.file, createWriteStream(tempFilePath))

        const processedFile = await processFile(tempFilePath, file.filename, file.mimetype)

        const embeddings = await generateEmbeddings(processedFile.content)

        const audioChunkResult = await db
          .insert(schema.audioChunks)
          .values({
            roomId,
            transcription: processedFile.content,
            embeddings,
          })
          .returning()

        await db
          .update(schema.rooms)
          .set({
            originalFileName: processedFile.fileName,
            originalFileType: processedFile.fileType,
            originalFileContent: processedFile.content,
          })
          .where(eq(schema.rooms.id, roomId))

        if (tempFilePath) {
          unlinkSync(tempFilePath)
        }

        return reply.status(201).send({ 
          message: 'Arquivo processado com sucesso',
          chunkId: audioChunkResult[0]?.id
        })
      } catch (error) {
        console.error('Erro ao processar arquivo:', error)
        
        if (tempFilePath) {
          try {
            unlinkSync(tempFilePath)
          } catch (unlinkError) {
            console.error('Erro ao remover arquivo temporário:', unlinkError)
          }
        }
        
        if (error instanceof Error && error.message.includes('429')) {
          return reply.status(429).send({ 
            error: 'Limite de requisições da API excedido. Tente novamente em alguns minutos.' 
          })
        } else if (error instanceof Error && error.message.includes('RESOURCE_EXHAUSTED')) {
          return reply.status(429).send({ 
            error: 'Cota da API esgotada. Tente novamente amanhã.' 
          })
        }
        
        return reply.status(500).send({ 
          error: 'Erro interno do servidor ao processar o arquivo.' 
        })
      }
    }
  )
} 