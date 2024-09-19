import Redis from 'ioredis'
import {configService} from "./services/config/config.service";

export const redisClient = new Redis({
    port: configService.getRedisPort(),
    host: configService.getRedisHost()
});

redisClient.on('ready', async () => {
    console.log('Redis ready');
})

export const isTerminate = async (): Promise<boolean> => {
    const flag = await redisClient.get('terminate');

    if (!flag) return false;

    await redisClient.unlink('terminate');
    return true;

}