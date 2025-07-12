import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { useUploadFile } from '@/http/use-upload-file'

interface FileUploadProps {
  roomId: string
}

export function FileUpload({ roomId }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { mutateAsync: uploadFile, isPending } = useUploadFile(roomId)

  const handleFileChange = (file: File) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('Tipo de arquivo não suportado. Apenas Word (.docx) e texto (.txt) são permitidos no momento.')
      return
    }

    setSelectedFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      await uploadFile(selectedFile)
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error)
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.includes('word') || file.type.includes('document')) return '📝'
    if (file.type.includes('text')) return '📄'
    return '📁'
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700/80 shadow-lg">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-white">Upload de Arquivo</h3>
            <p className="text-slate-400 text-sm">Word e texto</p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-slate-600 bg-slate-900/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,.txt"
            onChange={handleInputChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">{getFileIcon(selectedFile)}</span>
                <div className="text-left">
                  <p className="font-medium text-white">{selectedFile.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={isPending}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Enviar
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <div>
                <p className="font-medium text-white">Arraste um arquivo aqui</p>
                <p className="text-slate-400 text-sm">ou clique para selecionar</p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="border-slate-600 bg-slate-800 hover:bg-slate-700"
              >
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </div>

        <div className="mt-4 text-slate-400 text-xs">
          <p>Formatos suportados: Word (.docx), Texto (.txt)</p>
          <p>Tamanho máximo: 50MB</p>
          <p className="text-amber-400">⚠️ PDF temporariamente desabilitado</p>
        </div>
      </CardContent>
    </Card>
  )
} 