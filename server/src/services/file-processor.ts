import mammoth from 'mammoth'
import { readFile } from 'fs/promises'

export interface ProcessedFile {
  content: string
  fileName: string
  fileType: string
}

export async function processFile(
  filePath: string,
  fileName: string,
  mimeType: string
): Promise<ProcessedFile> {
  let content = ''
  let fileType = ''

  try {
    if (mimeType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      const buffer = await readFile(filePath)
      const result = await mammoth.extractRawText({ buffer })
      content = result.value
      fileType = 'docx'
    } else if (mimeType.includes('application/pdf')) {
      throw new Error('Processamento de PDF temporariamente desabilitado. Use arquivos Word (.docx) ou texto (.txt).')
    } else if (mimeType.includes('text/plain')) {
      content = await readFile(filePath, 'utf-8')
      fileType = 'txt'
    } else {
      throw new Error(`Tipo de arquivo não suportado: ${mimeType}`)
    }

    return {
      content: content.trim(),
      fileName,
      fileType
    }
  } catch (error) {
    console.error('Erro ao processar arquivo:', error)
    throw new Error(`Erro ao processar arquivo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
} 