import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

type RecordingStatus = 'recording' | 'paused' | 'stopped'

export function useRecordingControl(roomId: string) {
  const queryClient = useQueryClient()

  const { data: status } = useQuery({
    queryKey: ['recording-status', roomId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/recording/status`)
      return response.json()
    },
    refetchInterval: 1000,
  })

  const startRecording = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/recording/start`, {
        method: 'POST',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recording-status', roomId] })
    },
  })

  const pauseRecording = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/recording/pause`, {
        method: 'POST',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recording-status', roomId] })
    },
  })

  const resumeRecording = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/recording/resume`, {
        method: 'POST',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recording-status', roomId] })
    },
  })

  const stopRecording = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/recording/stop`, {
        method: 'POST',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recording-status', roomId] })
    },
  })

  return {
    status: status?.status as RecordingStatus || 'stopped',
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  }
} 