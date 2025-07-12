import { createWriteStream } from 'fs'
import { promises as fs } from 'fs'
import path from 'path'
import htmlPdf from 'html-pdf-node'
import { db } from '../db/connection.ts'
import { schema } from '../db/schemas/index.ts'
import { eq } from 'drizzle-orm'
import { dayjs } from '../lib/dayjs.ts'

export interface ExportData {
  roomName: string
  roomDescription?: string
  createdAt: Date
  questions: Array<{
    question: string
    answer: string | null
    createdAt: Date
  }>
  transcriptions: Array<{
    transcription: string
    createdAt: Date
  }>
}

export async function getRoomExportData(roomId: string): Promise<ExportData> {
  const room = await db
    .select()
    .from(schema.rooms)
    .where(eq(schema.rooms.id, roomId))
    .limit(1)

  if (!room[0]) {
    throw new Error('Sala não encontrada')
  }

  const questions = await db
    .select({
      question: schema.questions.question,
      answer: schema.questions.answer,
      createdAt: schema.questions.createdAt,
    })
    .from(schema.questions)
    .where(eq(schema.questions.roomId, roomId))
    .orderBy(schema.questions.createdAt)

  const transcriptions = await db
    .select({
      transcription: schema.audioChunks.transcription,
      createdAt: schema.audioChunks.createdAt,
    })
    .from(schema.audioChunks)
    .where(eq(schema.audioChunks.roomId, roomId))
    .orderBy(schema.audioChunks.createdAt)

  return {
    roomName: room[0].name,
    roomDescription: room[0].description || undefined,
    createdAt: room[0].createdAt,
    questions,
    transcriptions,
  }
}

export async function generatePdfExport(roomId: string): Promise<Buffer> {
  const data = await getRoomExportData(roomId)
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Exportação - ${data.roomName}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .question { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .answer { background: #e8f4f8; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .transcription { background: #f9f9f9; padding: 10px; margin: 5px 0; border-left: 3px solid #ccc; }
        .timestamp { color: #666; font-size: 0.9em; }
        h1 { color: #333; }
        h2 { color: #555; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.roomName}</h1>
        ${data.roomDescription ? `<p>${data.roomDescription}</p>` : ''}
        <p class="timestamp">Criado em: ${dayjs(data.createdAt).format('DD/MM/YYYY HH:mm')}</p>
      </div>

      <div class="section">
        <h2>Perguntas e Respostas</h2>
        ${data.questions.length > 0 ? data.questions.map(q => `
          <div class="question">
            <strong>Pergunta:</strong> ${q.question}
            <div class="timestamp">${dayjs(q.createdAt).format('DD/MM/YYYY HH:mm')}</div>
          </div>
          <div class="answer">
            <strong>Resposta:</strong> ${q.answer || 'Aguardando resposta...'}
          </div>
        `).join('') : '<p>Nenhuma pergunta encontrada.</p>'}
      </div>

      <div class="section">
        <h2>Transcrições</h2>
        ${data.transcriptions.length > 0 ? data.transcriptions.map(t => `
          <div class="transcription">
            ${t.transcription}
            <div class="timestamp">${dayjs(t.createdAt).format('DD/MM/YYYY HH:mm')}</div>
          </div>
        `).join('') : '<p>Nenhuma transcrição encontrada.</p>'}
      </div>
    </body>
    </html>
  `

  const options = {
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px',
    },
  }

  const result = await htmlPdf.generatePdf({ content: html }, options)
  return result
}

export async function generateWordExport(roomId: string): Promise<Buffer> {
  const data = await getRoomExportData(roomId)
  
  let content = `${data.roomName}\n`
  content += `=====================================\n\n`
  
  if (data.roomDescription) {
    content += `Descrição: ${data.roomDescription}\n\n`
  }
  
  content += `Criado em: ${dayjs(data.createdAt).format('DD/MM/YYYY HH:mm')}\n\n`
  
  content += `PERGUNTAS E RESPOSTAS\n`
  content += `=====================================\n\n`
  
  if (data.questions.length > 0) {
    data.questions.forEach((q, index) => {
      content += `${index + 1}. PERGUNTA (${dayjs(q.createdAt).format('DD/MM/YYYY HH:mm')})\n`
      content += `${q.question}\n\n`
      content += `RESPOSTA:\n`
      content += `${q.answer || 'Aguardando resposta...'}\n\n`
      content += `-------------------------------------\n\n`
    })
  } else {
    content += `Nenhuma pergunta encontrada.\n\n`
  }
  
  content += `TRANSCRIÇÕES\n`
  content += `=====================================\n\n`
  
  if (data.transcriptions.length > 0) {
    data.transcriptions.forEach((t, index) => {
      content += `${index + 1}. TRANSCRIÇÃO (${dayjs(t.createdAt).format('DD/MM/YYYY HH:mm')})\n`
      content += `${t.transcription}\n\n`
      content += `-------------------------------------\n\n`
    })
  } else {
    content += `Nenhuma transcrição encontrada.\n\n`
  }

  return Buffer.from(content, 'utf-8')
} 