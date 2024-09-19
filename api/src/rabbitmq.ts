import { OperationStatusesEnum } from './services/operation/enums/operation-statuses.enum'
import { OperationTypesEnum } from './services/operation/enums/operation-types.enum'
import { rebbitMQService } from './services/rebbitmq/rebbitmq.service'
import {
  QUEUE_REQUEST_NAME,
  QUEUE_RESPONSE_NAME,
} from './services/rebbitmq/rebbitmq.constants'
import { StorageMock } from './services/operation/storage.mock'

export const publishToQueue = async (
  id: number,
  data: Record<any, string>,
  mode: OperationTypesEnum
): Promise<OperationStatusesEnum> => {
  const channel = await rebbitMQService.getChannel()

  await rebbitMQService.addQToChannel([QUEUE_REQUEST_NAME, QUEUE_RESPONSE_NAME])

  const message = JSON.stringify({ id, data, mode })

  channel.sendToQueue(QUEUE_REQUEST_NAME, Buffer.from(message))

  return new Promise((resolve) => {
    if (mode === OperationTypesEnum.async)
      resolve(OperationStatusesEnum.inProgress)
    channel.consume(QUEUE_RESPONSE_NAME, (msg) => {
      let status: OperationStatusesEnum
      if (msg?.content) {
        status = parseInt(msg.content.toString(), 10) as OperationStatusesEnum
      } else {
        status = OperationStatusesEnum.notFound
      }

      StorageMock.updateItem(id, status)
      resolve(status)
      channel.ack(msg!)
    })
  }) as unknown as OperationStatusesEnum
}
