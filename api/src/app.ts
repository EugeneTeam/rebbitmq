import express from 'express'
import swaggerUi from 'swagger-ui-express'
import * as swaggerDocument from './swagger/swagger.json'
import { configService } from './services/config/config.service'
import { operationRouter } from './routers/operations.router'
import { queueRouter } from './routers/queue.router'
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware'
import { formatterMiddleware } from './middlewares/formatter.middleware'

const app = express()
app.use(express.json())

app.use(formatterMiddleware)

app.use(operationRouter)
app.use(queueRouter)

app.use(errorHandlerMiddleware)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = configService.getAppPort()

app.listen(PORT, () => {
  console.log(`Service API is running on port ${PORT}`)
})
