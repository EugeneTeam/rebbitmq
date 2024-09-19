import express, { Request, Response } from 'express'
import { operationService } from '../services/operation/operation.service'
import { OperationTypesEnum } from '../services/operation/enums/operation-types.enum'

const router = express.Router()

router.post('/operation/sync', async (req: Request, res: Response) => {
  const result = await operationService.createOperation(
    OperationTypesEnum.sync,
    req.body
  )
  res.json(result)
})

router.post('/operation/async', async (req: Request, res: Response) => {
  const result = await operationService.createOperation(
    OperationTypesEnum.async,
    req.body
  )
  res.json(result)
})

router.get('/status/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10)
  const result = operationService.getStatus({ id })
  res.json(result)
})

export { router as operationRouter }
