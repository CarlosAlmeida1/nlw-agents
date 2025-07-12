import { ArrowLeft, Radio } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { QuestionForm } from '@/components/question-form'
import { QuestionList } from '@/components/question-list'
import { FileUpload } from '@/components/file-upload'
import { ExportButtons } from '@/components/export-buttons'

type RoomParams = {
  roomId: string
}

export function Room() {
  const params = useParams<RoomParams>()

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-slate-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Voltar ao Início
              </Button>
            </Link>
            <Link to={`/room/${params.roomId}/audio`}>
              <Button className="flex items-center gap-2" variant="secondary">
                <Radio className="size-4" />
                Gravar Áudio
              </Button>
            </Link>
          </div>
          <h1 className="mb-2 font-bold text-3xl text-foreground">
            Sala de Perguntas
          </h1>
          <p className="text-muted-foreground">
            Faça perguntas, envie arquivos e exporte o conteúdo
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <div className="mb-8">
              <QuestionForm roomId={params.roomId} />
            </div>
            <QuestionList roomId={params.roomId} />
          </div>
          
          <div className="space-y-8">
            <FileUpload roomId={params.roomId} />
            <ExportButtons roomId={params.roomId} />
          </div>
        </div>
      </div>
    </div>
  )
}
