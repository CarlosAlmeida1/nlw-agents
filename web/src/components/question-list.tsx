import { HelpCircle, Sparkles } from 'lucide-react'
import { useRoomQuestions } from '@/http/use-room-questions'
import { QuestionItem } from './question-item'

interface QuestionListProps {
  roomId: string
}

export function QuestionList(props: QuestionListProps) {
  const { data } = useRoomQuestions(props.roomId)

  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="-m-4 absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10" />
        <div className="relative flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
              <HelpCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-white to-slate-300 bg-clip-text font-bold text-2xl text-transparent">
                Perguntas & Respostas
              </h2>
              <p className="flex items-center gap-1 text-slate-400 text-sm">
                <Sparkles className="h-3 w-3" />
                Powered by AI
              </p>
            </div>
          </div>

          {data && data.length > 0 && (
            <div className="hidden items-center gap-2 rounded-full border border-blue-800 bg-gradient-to-r from-blue-950/50 to-indigo-950/50 px-3 py-1.5 sm:flex">
              <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
              <span className="font-medium text-blue-300 text-xs">
                {data.length} pergunta{data.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {data?.map((question) => {
          return <QuestionItem key={question.id} question={question} />
        })}

        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-6 rounded-full bg-gradient-to-br from-slate-800 to-slate-700 p-4">
              <HelpCircle className="h-8 w-8 text-slate-500" />
            </div>
            <h3 className="mb-2 font-semibold text-lg text-slate-300">
              Nenhuma pergunta ainda
            </h3>
            <p className="max-w-md text-slate-500">
              Seja o primeiro a fazer uma pergunta! Nossa IA está pronta para
              ajudar com qualquer dúvida.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
