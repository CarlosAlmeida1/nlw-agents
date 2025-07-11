import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateQuestionRequest } from './types/create-question-request'
import type { CreateQuestionResponse } from './types/create-question-response'
import type { GetRoomQuestionsResponse } from './types/get-room-questions-response'

export function useCreateQuestion(roomId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ question }: CreateQuestionRequest) => {
      const response = await fetch(
        `http://localhost:3000/rooms/${roomId}/questions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
          }),
        }
      )

      const result: CreateQuestionResponse = await response.json()

      return result
    },

    onMutate({ question }) {
      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        'get-room-questions',
        roomId,
      ])

      const questionsArray = questions ?? []

      const newQuestion = {
        id: crypto.randomUUID(),
        question,
        answer: null,
        createdAt: new Date().toISOString(),
        isGeneratingAnswer: true,
      }

      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-room-questions', roomId],
        [newQuestion, ...questionsArray]
      )

      return { newQuestion, questions }
    },

    onSuccess: async (data, variables, context) => {
      if (!context) return

      const questions = queryClient.getQueryData<GetRoomQuestionsResponse>([
        'get-room-questions',
        roomId,
      ])

      if (questions) {
        const updatedQuestions = questions.map(q => 
          q.id === context.newQuestion.id
            ? { ...q, id: data.questionId, isGeneratingAnswer: true }
            : q
        )

        queryClient.setQueryData<GetRoomQuestionsResponse>(
          ['get-room-questions', roomId],
          updatedQuestions
        )

        // Inicia verificação periódica para ver se a resposta foi gerada
        const checkAnswerInterval = setInterval(async () => {
          try {
            const response = await fetch(
              `http://localhost:3000/rooms/${roomId}/questions/${data.questionId}`
            )
            
            if (response.ok) {
              const questionData = await response.json()
              
              // Se a resposta foi gerada, atualiza a pergunta e para o polling
              if (questionData.answer) {
                clearInterval(checkAnswerInterval)
                
                const currentQuestions = queryClient.getQueryData<GetRoomQuestionsResponse>([
                  'get-room-questions',
                  roomId,
                ])
                
                if (currentQuestions) {
                  const updatedQuestions = currentQuestions.map(q => 
                    q.id === data.questionId
                      ? { ...questionData, isGeneratingAnswer: false }
                      : q
                  )
                  
                  queryClient.setQueryData<GetRoomQuestionsResponse>(
                    ['get-room-questions', roomId],
                    updatedQuestions
                  )
                }
              }
            }
          } catch (error) {
            console.error('Erro ao verificar resposta:', error)
          }
        }, 2000) // Verifica a cada 2 segundos

        // Para o polling após 2 minutos para evitar requests infinitos
        setTimeout(() => {
          clearInterval(checkAnswerInterval)
        }, 120000)
      }
    },

    onError: (error, variables, context) => {
      if (!context) return

      // Remove a pergunta temporária em caso de erro
      queryClient.setQueryData<GetRoomQuestionsResponse>(
        ['get-room-questions', roomId],
        context.questions ?? []
      )
    },
  })
}
