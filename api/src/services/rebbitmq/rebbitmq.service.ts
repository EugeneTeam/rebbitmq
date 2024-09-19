import amqp, { Channel, Connection } from 'amqplib'
import { configService } from '../config/config.service'

class RebbitMQService {
  private _connect: Connection | null = null
  private _queue: Map<string, string> = new Map<string, string>()
  private _channel: Channel | null = null

  public async deleteQueue(queue: string): Promise<void> {
    await this._channel?.deleteQueue(queue)
    this._queue.delete(queue)
  }

  public async getChannel(): Promise<Channel> {
    if (this._channel) {
      return this._channel
    }

    if (!this._connect) {
      this._connect = await amqp.connect(configService.getRebbitMQUrl())
    }

    this._channel = await this._connect.createChannel()

    return this._channel
  }

  public async addQToChannel(queues: string[]) {
    for (const queue of queues) {
      if (!this._queue.get(queue)) {
        await this._channel?.assertQueue(queue, {
          durable: true,
          arguments: {
            // limitation for example
            'x-max-length': 10,
          },
        })
      }
    }
  }
}

export const rebbitMQService = new RebbitMQService()
