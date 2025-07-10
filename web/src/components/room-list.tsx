import { ArrowRight, Clock, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRooms } from '@/http/use-rooms'
import { dayjs } from '@/lib/dayjs'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

export function RoomList() {
  const { data, isLoading, error } = useRooms()

  // Garantir que data é um array
  const rooms = Array.isArray(data) ? data : []

  return (
    <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800/50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="bg-gradient-to-r from-white to-slate-300 bg-clip-text font-bold text-2xl text-transparent">
          Salas Recentes
        </CardTitle>
        <CardDescription className="text-slate-400">
          Acesso rápido para as salas criadas recentemente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-slate-400 text-sm">Carregando salas...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-red-950/50 p-3">
              <MessageCircle className="h-6 w-6 text-red-400" />
            </div>
            <p className="font-medium text-red-300">Erro ao carregar salas</p>
            <p className="mt-1 text-slate-500 text-sm">
              Verifique sua conexão e tente novamente
            </p>
          </div>
        )}

        {!(isLoading || error) &&
          rooms.map((room) => {
            return (
              <Link
                className="group relative flex flex-col rounded-xl border-0 bg-gradient-to-r from-slate-800 to-slate-700/80 p-4 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-lg hover:shadow-primary/10 sm:flex-row sm:items-center sm:justify-between"
                key={room.id}
                to={`/room/${room.id}`}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 to-primary/0 transition-all duration-300 group-hover:from-primary/10 group-hover:to-primary/5" />

                <div className="relative flex flex-1 flex-col gap-3">
                  <h3 className="font-semibold text-lg text-white transition-colors duration-300 group-hover:text-primary">
                    {room.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <Badge
                      className="flex items-center gap-1.5 border-blue-800 bg-blue-950/50 text-blue-300 text-xs hover:bg-blue-900/50"
                      variant="secondary"
                    >
                      <Clock className="h-3 w-3" />
                      {dayjs(room.createdAt).toNow()}
                    </Badge>
                    <Badge
                      className="flex items-center gap-1.5 border-emerald-800 bg-emerald-950/50 text-emerald-300 text-xs hover:bg-emerald-900/50"
                      variant="secondary"
                    >
                      <MessageCircle className="h-3 w-3" />
                      {room.questionsCount} pergunta(s)
                    </Badge>
                  </div>
                </div>

                <span className="relative mt-4 flex items-center gap-2 self-end font-medium text-slate-400 text-sm transition-all duration-300 group-hover:text-primary sm:mt-0 sm:self-auto">
                  Entrar
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-200 ease-in-out group-hover:translate-x-2 group-hover:scale-110" />
                </span>
              </Link>
            )
          })}

        {!(isLoading || error) && rooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-slate-800 p-3">
              <MessageCircle className="h-6 w-6 text-slate-500" />
            </div>
            <p className="font-medium text-slate-300">
              Nenhuma sala encontrada
            </p>
            <p className="mt-1 text-slate-500 text-sm">
              Crie sua primeira sala para começar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
