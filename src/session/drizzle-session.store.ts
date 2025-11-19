import session from 'express-session'
import { DB_CONNECTION } from '../db/db.module'
import * as schema from '../db/schema'
import { eq } from 'drizzle-orm'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'

export class DrizzleStore extends session.Store {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    super()
  }

  async get(sid: string, callback: (err: any, session?: any) => void) {
    try {
      const rows = await this.db
        .select()
        .from(schema.session)
        .where(eq(schema.session.id, sid))

      if (!rows[0]) return callback(null, null)
      callback(null, JSON.parse(rows[0].data))
    } catch (err) {
      callback(err)
    }
  }

  async set(sid: string, sess: any, callback?: (err?: any) => void) {
    try {
      const expires = sess.cookie?.expires
        ? new Date(sess.cookie.expires)
        : new Date(Date.now() + 24 * 60 * 60 * 1000)

      await this.db
        .insert(schema.session)
        .values({ id: sid, data: JSON.stringify(sess), expires_at: expires })
        .onConflictDoUpdate({
          target: schema.session.id,
          set: { data: JSON.stringify(sess), expires_at: expires },
        })

      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void) {
    try {
      await this.db.delete(schema.session).where(eq(schema.session.id, sid))
      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }
}
