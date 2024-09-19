import amqp from 'amqplib'
import { configService } from './services/config/config.service'
import {QUEUE_REQUEST_NAME} from "./services/rebbitmq/rebbitmq.constants";
import {operationConsumer} from "./consumers/operation.consumer";



export const consumeQueue = async () => {
    const connection = await amqp.connect(configService.getRebbitMQUrl())
    const channel = await connection.createChannel()
    await channel.assertQueue(QUEUE_REQUEST_NAME, {
      durable: true,
      arguments: {
        'x-max-length': 10,
      },
    })
    await channel.prefetch(5)

    channel.consume(QUEUE_REQUEST_NAME, operationConsumer(channel, QUEUE_REQUEST_NAME))
}
