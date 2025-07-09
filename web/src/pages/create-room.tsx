import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

type GetRoomsResponse = Array<{
  id: string
  name: string
}>

export function CreateRoom() {
  const { data, isLoading } = useQuery({
    queryKey: ['get-rooms'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3000/rooms')
      const result: GetRoomsResponse = await response.json()
      return result
    },
  })
  return (
    <div>
      {isLoading && <div>Loading...</div>}

      <div>
        {data?.map((room) => {
          return (
            <div key={room.id}>
              <Link to={`/room/${room.id}`}>{room.name}</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
