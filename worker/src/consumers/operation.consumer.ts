import {OperationTypesEnum} from "../services/operation/enums/operation-types.enum";
import {isTerminate} from "../redis";
import {OperationStatusesEnum} from "../services/operation/enums/operation-statuses.enum";
import {Channel, ConsumeMessage} from "amqplib";

export const operationConsumer = (channel: Channel, queueName: string): (msg: ConsumeMessage | null) => Promise<void>  => {
    return async (msg: ConsumeMessage | null): Promise<void> => {
        if (msg) {
            const {mode} = JSON.parse(msg.content.toString())
            if (mode === OperationTypesEnum.sync) {
                if (await isTerminate()) return
                channel.sendToQueue(queueName, Buffer.from(OperationStatusesEnum.pending.toString()))
            }

            // some operation
            await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true)
                }, 5000)
            })

            if (await isTerminate()) return

            channel.sendToQueue(queueName, Buffer.from(OperationStatusesEnum.success.toString()))
            channel.ack(msg);
        }
    }
}