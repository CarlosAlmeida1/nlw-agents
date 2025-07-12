export function useExportRoom(roomId: string) {
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToPdf = async () => {
    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/export/pdf`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar PDF')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      downloadFile(url, `sala-${roomId}.pdf`)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      throw error
    }
  }

  const exportToWord = async () => {
    try {
      const response = await fetch(`http://localhost:3000/rooms/${roomId}/export/word`)
      
      if (!response.ok) {
        throw new Error('Erro ao gerar Word')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      downloadFile(url, `sala-${roomId}.docx`)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao exportar Word:', error)
      throw error
    }
  }

  return {
    exportToPdf,
    exportToWord,
  }
} 