/** biome-ignore-all lint/suspicious/noConsole: arquivo de debug necessário para desenvolvimento */

import { ArrowLeft, Mic, MicOff, Pause, Play, Radio, Waves } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRecordingControl } from '@/http/use-recording-control'

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === 'function' &&
  typeof window.MediaRecorder === 'function'

type RoomParams = {
  roomId: string
}

export function RecordRoomAudio() {
  const params = useParams<RoomParams>()
  const { status, startRecording, pauseRecording, resumeRecording, stopRecording } = useRecordingControl(params.roomId!)
  const [isInitializing, setIsInitializing] = useState(false)
  const recorder = useRef<MediaRecorder | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  async function uploadAudio(audio: Blob) {
    try {
      const formData = new FormData()
      formData.append('file', audio, 'audio.webm')

      const response = await fetch(`http://localhost:3000/rooms/${params.roomId}/audio`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Áudio enviado:', result)
      }
    } catch (error) {
      console.error('Erro ao enviar áudio:', error)
    }
  }

  function createRecorder(stream: MediaStream) {
    recorder.current = new MediaRecorder(stream, {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 64_000,
    })

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data)
      }
    }

    recorder.current.start()
  }

  async function handleStart() {
    if (!isRecordingSupported) {
      alert('Seu navegador não suporta gravação')
      return
    }

    setIsInitializing(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44_100,
        },
      })

      mediaStreamRef.current = stream
      createRecorder(stream)
      await startRecording.mutateAsync()

      intervalRef.current = setInterval(() => {
        if (recorder.current?.state !== 'inactive') {
          recorder.current?.stop()
          setTimeout(() => createRecorder(stream), 100)
        }
      }, 5000)
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error)
      alert('Erro ao acessar microfone')
    } finally {
      setIsInitializing(false)
    }
  }

  async function handlePause() {
    await pauseRecording.mutateAsync()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    recorder.current?.stop()
  }

  async function handleResume() {
    await resumeRecording.mutateAsync()
    if (mediaStreamRef.current) {
      createRecorder(mediaStreamRef.current)
      intervalRef.current = setInterval(() => {
        if (recorder.current?.state !== 'inactive') {
          recorder.current?.stop()
          setTimeout(() => createRecorder(mediaStreamRef.current!), 100)
        }
      }, 5000)
    }
  }

  async function handleStop() {
    await stopRecording.mutateAsync()
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    recorder.current?.stop()
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      recorder.current?.stop()
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (!params.roomId) {
    return <Navigate replace to="/" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-4 py-8">
      <div className="mx-auto max-w-md">
        <Card className="border-0 bg-gradient-to-br from-slate-800 via-slate-800 to-red-950/20 shadow-2xl">
          <CardHeader className="pb-4 text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/25">
                <Radio className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-white to-slate-300 bg-clip-text font-bold text-2xl text-transparent">
                  Gravação de Áudio
                </CardTitle>
                <p className="mt-1 flex items-center justify-center gap-1 text-slate-400 text-sm">
                  <Waves className="h-3 w-3" />
                  Streaming em tempo real
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className="relative flex gap-3 w-full">
                {status === 'recording' && (
                  <div className="absolute inset-0 animate-ping rounded-full bg-red-500/20" />
                )}
                
                {status === 'stopped' ? (
                  <Button
                    className="h-14 w-full bg-gradient-to-r from-emerald-600 to-green-600 shadow-emerald-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    onClick={handleStart}
                    disabled={isInitializing}
                    size="lg"
                  >
                    {isInitializing ? (
                      <>
                        <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Iniciando...
                      </>
                    ) : (
                      <>
                        <Mic className="mr-3 h-5 w-5" />
                        Iniciar gravação
                      </>
                    )}
                  </Button>
                ) : status === 'paused' ? (
                  <div className="flex w-full gap-3">
                    <Button
                      className="h-14 flex-1 bg-gradient-to-r from-emerald-600 to-green-600 shadow-emerald-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-emerald-700 hover:to-green-700"
                      onClick={handleResume}
                      size="lg"
                    >
                      <Play className="mr-3 h-5 w-5" />
                      Continuar
                    </Button>
                    <Button
                      className="h-14 flex-1 bg-gradient-to-r from-slate-600 to-slate-700 shadow-slate-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-slate-700 hover:to-slate-800"
                      onClick={handleStop}
                      size="lg"
                    >
                      <MicOff className="mr-3 h-5 w-5" />
                      Parar
                    </Button>
                  </div>
                ) : (
                  <div className="flex w-full gap-3">
                    <Button
                      className="h-14 flex-1 bg-gradient-to-r from-amber-600 to-orange-600 shadow-amber-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-amber-700 hover:to-orange-700"
                      onClick={handlePause}
                      size="lg"
                    >
                      <Pause className="mr-3 h-5 w-5" />
                      Pausar
                    </Button>
                    <Button
                      className="h-14 flex-1 bg-gradient-to-r from-red-600 to-red-700 shadow-red-500/25 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-red-700 hover:to-red-800"
                      onClick={handleStop}
                      size="lg"
                    >
                      <MicOff className="mr-3 h-5 w-5" />
                      Parar
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex w-full items-center gap-4 rounded-xl border border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-700/50 p-4 backdrop-blur-sm">
                <div className="flex flex-1 items-center gap-3">
                  {isInitializing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-500" />
                      <div className="flex-1">
                        <span className="block font-semibold text-blue-400">🎙️ Iniciando...</span>
                        <span className="text-slate-500 text-xs">Acessando microfone</span>
                      </div>
                    </>
                  ) : status === 'recording' ? (
                    <>
                      <div className="relative">
                        <span className="flex h-4 w-4 animate-pulse rounded-full bg-red-500" />
                        <span className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-red-500 opacity-75" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-red-400">🔴 Gravando...</span>
                        <span className="text-slate-500 text-xs">Áudio sendo enviado para IA</span>
                      </div>
                    </>
                  ) : status === 'paused' ? (
                    <>
                      <div className="relative">
                        <span className="flex h-4 w-4 animate-pulse rounded-full bg-amber-500" />
                        <span className="absolute inset-0 h-4 w-4 animate-ping rounded-full bg-amber-500 opacity-50" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-amber-400">⏸️ Pausado</span>
                        <span className="text-slate-500 text-xs">Gravação pausada, clique em "Continuar" para retomar</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="h-4 w-4 rounded-full bg-slate-500" />
                      <div className="flex-1">
                        <span className="block font-semibold text-slate-400">⏹️ Parado</span>
                        <span className="text-slate-500 text-xs">Pronto para iniciar gravação</span>
                      </div>
                    </>
                  )}
                </div>

                {status === 'recording' && (
                  <div className="flex space-x-1">
                    <div className="h-6 w-1 animate-pulse rounded-full bg-red-500" />
                    <div
                      className="h-4 w-1 animate-pulse rounded-full bg-red-400"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="h-8 w-1 animate-pulse rounded-full bg-red-500"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="h-3 w-1 animate-pulse rounded-full bg-red-400"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <div
                      className="h-7 w-1 animate-pulse rounded-full bg-red-500"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                )}

                {status === 'paused' && (
                  <div className="flex space-x-1">
                    <div className="h-6 w-1 animate-pulse rounded-full bg-amber-500" />
                    <div
                      className="h-4 w-1 animate-pulse rounded-full bg-amber-400"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="h-8 w-1 animate-pulse rounded-full bg-amber-500"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <div
                      className="h-3 w-1 animate-pulse rounded-full bg-amber-400"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <div
                      className="h-7 w-1 animate-pulse rounded-full bg-amber-500"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </div>
                )}
              </div>

              <div className="w-full rounded-lg border border-blue-800/30 bg-gradient-to-r from-blue-950/30 to-purple-950/30 p-4">
                <p className="text-center text-slate-300 text-sm leading-relaxed">
                  🎙️ <strong>Como funciona:</strong> O áudio é enviado automaticamente a cada 5 segundos para nossa IA processar e gerar perguntas relevantes. Você pode pausar e retomar a gravação a qualquer momento.
                </p>
              </div>
            </div>

            <div className="border-slate-700 border-t pt-6">
              <Button
                asChild
                className="h-12 w-full text-slate-300 hover:bg-slate-800/50 hover:text-white"
                variant="ghost"
              >
                <Link to={`/room/${params.roomId}`}>
                  <ArrowLeft className="mr-3 h-4 w-4" />
                  Voltar para a sala
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
