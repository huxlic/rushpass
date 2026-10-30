import { Inject, Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { createClient } from 'redis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export type RedisClient = ReturnType<typeof createClient>;

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async () => {
        const client = createClient();
        client.on('error', (err) => new Logger('Redis').error(err));
        await client.connect();
        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly client: RedisClient) {}

  async onApplicationShutdown() {
    await this.client.close();
  }
}
