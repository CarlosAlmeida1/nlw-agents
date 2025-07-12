import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { GetRoomQuestionsResponse } from './types/get-room-questions-response'

export function useUploadFile(roomId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(
        `http://localhost:3000/rooms/${roomId}/upload-file`,
        {
          method: 'POST',
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar arquivo')
      }

      const result = await response.json()
      return result
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-room-questions', roomId],
      })
    },
  })
} 