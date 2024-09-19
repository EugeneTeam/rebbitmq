import { publishToQueue } from '../../rabbitmq'
import { OperationTypesEnum } from './enums/operation-types.enum'
import { IId, IOperationBody, IOperationStatus } from './operation.interfaces'
import { OperationStatusesEnum } from './enums/operation-statuses.enum'
import { StorageMock } from './storage.mock'
import { redisClient } from '../../redis'
import { TERMINATE_TTL } from './operation.constants'
import { CustomError } from '../../errors/custom.error'

export class OperationService {
  async createOperation(
    mode: OperationTypesEnum,
    body: IOperationBody
  ): Promise<IOperationStatus> {
    const { id, data } = body
    StorageMock.addItem(id, OperationStatusesEnum.inProgress)

    if (mode === OperationTypesEnum.sync) {
      const result = await publishToQueue(id, data, mode)
      StorageMock.addItem(id, result)
      return { id, status: result }
    } else {
      publishToQueue(id, data, mode)
      StorageMock.addItem(id, OperationStatusesEnum.inProgress)
      return { id, status: OperationStatusesEnum.inProgress }
    }
  }

  getStatus(params: IId): IOperationStatus | never {
    const { id } = params

    const operation = StorageMock.getItem(id)
    if (!Number.isInteger(operation)) {
      throw new CustomError('Operation not found', 404)
    }

    return {
      id,
      status: operation,
    }
  }

  async stopAllOperations(): Promise<void> {
    StorageMock.clear()
    await redisClient.set('terminate', 'true', 'EX', TERMINATE_TTL)
  }
}

export const operationService = new OperationService()
