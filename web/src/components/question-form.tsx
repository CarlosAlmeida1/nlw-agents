import { zodResolver } from '@hookform/resolvers/zod'
import { HelpCircle, Send, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useCreateQuestion } from '@/http/use-create-question'

// Esquema de validação no mesmo arquivo conforme solicitado
const createQuestionSchema = z.object({
  question: z
    .string()
    .min(1, 'Pergunta é obrigatória')
    .min(10, 'Pergunta deve ter pelo menos 10 caracteres')
    .max(500, 'Pergunta deve ter menos de 500 caracteres'),
})

type CreateQuestionFormData = z.infer<typeof createQuestionSchema>

interface QuestionFormProps {
  roomId: string
}

export function QuestionForm({ roomId }: QuestionFormProps) {
  const { mutateAsync: createQuestion } = useCreateQuestion(roomId)

  const form = useForm<CreateQuestionFormData>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      question: '',
    },
  })

  async function handleCreateQuestion(data: CreateQuestionFormData) {
    await createQuestion(data)
  }

  const { isSubmitting } = form.formState

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-800 to-blue-950/30 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-blue-500/25 shadow-lg">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="bg-gradient-to-r from-white to-slate-300 bg-clip-text font-bold text-2xl text-transparent">
              Fazer uma Pergunta
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5 text-slate-400">
              <Sparkles className="h-3 w-3 text-blue-400" />
              Digite sua pergunta e receba uma resposta gerada por I.A.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleCreateQuestion)}
          >
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="font-semibold text-base text-white">
                    Sua Pergunta
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        className="min-h-[120px] resize-none border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-700/50 text-white transition-colors duration-300 placeholder:text-slate-500 focus:border-blue-500"
                        disabled={isSubmitting}
                        placeholder="O que você gostaria de saber? Seja específico para obter uma resposta mais precisa..."
                        {...field}
                      />
                      <div className="absolute right-3 bottom-3 text-slate-500 text-xs">
                        {field.value.length}/500
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              className="h-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-blue-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 disabled:hover:scale-100"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enviando pergunta...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Enviar pergunta
                </div>
              )}
            </Button>

            <div className="rounded-lg border border-blue-800/50 bg-gradient-to-r from-blue-950/50 to-purple-950/50 p-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                💡 <strong>Dica:</strong> Perguntas mais específicas e
                detalhadas geram respostas mais precisas e úteis da nossa IA.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
