import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateRoom } from '@/http/use-create-room'

const createRoomFormSchema = z.object({
  name: z.string().min(1, 'Nome da sala é obrigatório'),
  description: z.string().optional(),
  isPublic: z.boolean(),
})

type CreateRoomFormData = z.infer<typeof createRoomFormSchema>

export function CreateRoomForm() {
  const navigate = useNavigate()
  const { mutateAsync: createRoom } = useCreateRoom()

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomFormSchema),
    defaultValues: {
      name: '',
      description: '',
      isPublic: false,
    },
  })

  async function onSubmit(data: CreateRoomFormData) {
    try {
      const result = await createRoom(data)
      navigate(`/room/${result.roomId}`)
    } catch (error) {
      console.error('Erro ao criar sala:', error)
    }
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-800 to-slate-700/80 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-purple-600">
            <Plus className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg text-white">Criar Nova Sala</CardTitle>
            <p className="text-slate-400 text-sm">Configure sua sala de perguntas</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Nome da Sala</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Aula de React"
                      className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-200">Descrição (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o tema da sala..."
                      className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-primary focus:ring-primary"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-slate-200">
                      Sala Pública
                    </FormLabel>
                    <p className="text-slate-400 text-sm">
                      Permitir que outros usuários encontrem e acessem esta sala
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Sala
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
