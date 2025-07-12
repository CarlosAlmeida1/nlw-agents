import { Download, FileText, File } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useExportRoom } from '@/http/use-export-room'

interface ExportButtonsProps {
  roomId: string
}

export function ExportButtons({ roomId }: ExportButtonsProps) {
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [isExportingWord, setIsExportingWord] = useState(false)
  const { exportToPdf, exportToWord } = useExportRoom(roomId)

  const handleExportPdf = async () => {
    setIsExportingPdf(true)
    try {
      await exportToPdf()
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao exportar PDF. Tente novamente.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  const handleExportWord = async () => {
    setIsExportingWord(true)
    try {
      await exportToWord()
    } catch (error) {
      console.error('Erro ao exportar Word:', error)
      alert('Erro ao exportar Word. Tente novamente.')
    } finally {
      setIsExportingWord(false)
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700/80 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Exportar Conteúdo</CardTitle>
            <p className="text-slate-400 text-sm">Baixe transcrições e perguntas</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleExportPdf}
          disabled={isExportingPdf}
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:opacity-50"
        >
          {isExportingPdf ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Gerando PDF...
            </>
          ) : (
            <>
              <File className="mr-2 h-4 w-4" />
              Exportar como PDF
            </>
          )}
        </Button>

        <Button
          onClick={handleExportWord}
          disabled={isExportingWord}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
        >
          {isExportingWord ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Gerando Word...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Exportar como Word
            </>
          )}
        </Button>

        <div className="mt-4 text-slate-400 text-xs">
          <p>• PDF: Formatação rica com estilos</p>
          <p>• Word: Documento editável</p>
          <p>• Inclui todas as transcrições e perguntas</p>
        </div>
      </CardContent>
    </Card>
  )
} 