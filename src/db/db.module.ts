import { Global, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

export const DB_CONNECTION = Symbol('DB_CONNECTION')

@Global()
@Module({
  providers: [
    {
      provide: DB_CONNECTION,
      inject: [ConfigService],
      useFactory: (configService: ConfigService): PostgresJsDatabase<typeof schema> => {
        const connectionString = `postgresql://${configService.get('DB_USER') ?? 'postgres'}:${configService.get('DB_PASSWORD') ?? 'password'}@${configService.get('DB_HOST') ?? 'localhost'}:${configService.get('DB_PORT') ?? '5432'}/${configService.get('DB_NAME') ?? 'postgres'}`
        const client = postgres(connectionString)
        return drizzle(client, { schema })
      },
    },
  ],
  exports: [DB_CONNECTION],
})
export class DbModule {}
