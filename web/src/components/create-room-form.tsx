import { zodResolver } from '@hookform/resolvers/zod'
import { FileText, Plus, Sparkles, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { useCreateRoom } from '@/http/use-create-room'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

const createRoomSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

export function CreateRoomForm() {
  const { mutateAsync: createRoom } = useCreateRoom()

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  async function handleCreateRoom({ name, description }: CreateRoomFormData) {
    await createRoom({ name, description })

    createRoomForm.reset()
  }

  const { isSubmitting } = createRoomForm.formState

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-800 to-emerald-950/30 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/25 shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="bg-gradient-to-r from-white to-slate-300 bg-clip-text font-bold text-2xl text-transparent">
              Criar Sala
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1.5 text-slate-400">
              <Sparkles className="h-3 w-3 text-emerald-400" />
              Crie uma nova sala para começar a fazer perguntas e receber
              respostas da I.A.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="space-y-6"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 font-semibold text-base text-white">
                      <Users className="h-4 w-4 text-emerald-400" />
                      Nome da Sala
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-700/50 text-white transition-colors duration-300 placeholder:text-slate-500 focus:border-emerald-500"
                        disabled={isSubmitting}
                        placeholder="Digite um nome atrativo para sua sala..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem className="space-y-3">
                    <FormLabel className="flex items-center gap-2 font-semibold text-base text-white">
                      <FileText className="h-4 w-4 text-emerald-400" />
                      Descrição
                      <span className="font-normal text-slate-500 text-sm">
                        (opcional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[100px] resize-none border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-700/50 text-white transition-colors duration-300 placeholder:text-slate-500 focus:border-emerald-500"
                        disabled={isSubmitting}
                        placeholder="Descreva o propósito da sua sala ou adicione contexto para as perguntas..."
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )
              }}
            />

            <Button
              className="h-12 w-full bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-emerald-700 hover:to-teal-700 disabled:hover:scale-100"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Criando sala...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Criar sala
                </div>
              )}
            </Button>

            <div className="rounded-lg border border-emerald-800/50 bg-gradient-to-r from-emerald-950/50 to-teal-950/50 p-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                🏆 <strong>Dica:</strong> Salas com nomes claros e descrições
                específicas tendem a gerar conversas mais focadas e produtivas.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
