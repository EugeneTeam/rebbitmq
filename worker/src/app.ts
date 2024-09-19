import { consumeQueue } from './rabbitmq'

console.log('Worker service is running')
consumeQueue()
