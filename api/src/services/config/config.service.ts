import * as dotenv from 'dotenv'

dotenv.config()

class ConfigService {
  public getAppPort(): number {
    const port = this.getValue('APP_PORT')
    return parseInt(port, 10)
  }

  public getRedisHost(): string {
    return this.getValue('REDIS_HOST')
  }

  public getRedisPort(): number {
    const port = this.getValue('REDIS_PORT')
    return parseInt(port, 10)
  }

  public getRebbitMQUrl(): string {
    return this.getValue('RABBITMQ_URL')
  }

  public getValue(key: string): string {
    const value = process.env[key]
    if (!value) {
      throw new Error(`Unknown environment variable: [${key}]`)
    }

    return value
  }
}

export const configService = new ConfigService()
