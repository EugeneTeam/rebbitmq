import express from 'express'
import { StorageMock } from '../services/operation/storage.mock'
import { operationService } from '../services/operation/operation.service'

const router = express.Router()

router.post('/clear', (req, res) => {
  StorageMock.deleteAllExceptInProgress()
  res.json({ message: 'All completed operations have been cleared.' })
})

router.post('/terminate', async (req, res) => {
  await operationService.stopAllOperations()
  res.json({ message: 'All operations have been terminated and cleared.' })
})

export { router as queueRouter }
