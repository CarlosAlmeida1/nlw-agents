import { Bot, Clock, Loader2, MessageSquare } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { dayjs } from '@/lib/dayjs'

interface Question {
  id: string
  question: string
  answer?: string | null
  createdAt: string
  isGeneratingAnswer?: boolean
}

interface QuestionItemProps {
  question: Question
}

export function QuestionItem({ question }: QuestionItemProps) {
  return (
    <Card className="group border-0 bg-gradient-to-br from-slate-800 to-slate-900/30 shadow-sm transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Question */}
          <div className="relative">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25 shadow-lg">
                  <MessageSquare className="size-5 text-white" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">Pergunta</p>
                  <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-transparent" />
                </div>
                <div className="rounded-lg border border-blue-800/50 bg-gradient-to-r from-blue-950/50 to-blue-900/30 p-4">
                  <p className="text-blue-100 leading-relaxed">
                    {question.question}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {(!!question.answer || question.isGeneratingAnswer) && (
            <>
              {/* Divider */}
              <div className="relative flex items-center">
                <div className="flex-grow border-slate-700 border-t" />
                <div className="flex-shrink-0 px-4">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                </div>
                <div className="flex-grow border-slate-700 border-t" />
              </div>

              {/* Answer */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25">
                    <Bot className="size-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white">Resposta da IA</p>
                    <div className="h-1 w-8 rounded-full bg-gradient-to-r from-purple-500 to-transparent" />
                  </div>
                  <div className="rounded-lg border border-purple-800/50 bg-gradient-to-r from-purple-950/50 to-pink-950/30 p-4">
                    {question.isGeneratingAnswer ? (
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Loader2 className="size-5 animate-spin text-purple-400" />
                          <div className="absolute inset-0 size-5 animate-ping rounded-full bg-purple-400 opacity-25" />
                        </div>
                        <div className="space-y-1">
                          <span className="block font-medium text-purple-300 text-sm">
                            Gerando resposta...
                          </span>
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400" />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                              style={{ animationDelay: '0.1s' }}
                            />
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line text-purple-100 leading-relaxed">
                        {question.answer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Timestamp */}
          <div className="flex justify-end border-slate-700 border-t pt-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Clock className="h-3 w-3" />
              <span>{dayjs(question.createdAt).toNow()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
