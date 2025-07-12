import { fastifyCors } from '@fastify/cors'
import { fastifyMultipart } from '@fastify/multipart'
import { fastify } from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env.ts'
import { createQuestionRoute } from './http/routes/create-question.ts'
import { createRoomRoute } from './http/routes/create-room.ts'
import { getRoomQuestions } from './http/routes/get-room-questions.ts'
import { getRoomsRoute } from './http/routes/get-rooms.ts'
import { recordingControlRoute } from './http/routes/recording-control.ts'
import { uploadAudioRoute } from './http/routes/upload-audio.ts'
import { uploadFileRoute } from './http/routes/upload-file.ts'
import { exportRoomRoute } from './http/routes/export-room.ts'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
})

app.register(fastifyMultipart, {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createRoomRoute)
app.register(getRoomsRoute)
app.register(createQuestionRoute)
app.register(getRoomQuestions)
app.register(recordingControlRoute)
app.register(uploadAudioRoute)
app.register(uploadFileRoute)
app.register(exportRoomRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})