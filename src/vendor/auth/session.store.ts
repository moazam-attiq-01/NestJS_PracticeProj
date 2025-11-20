import { Store } from 'express-session'
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import * as schema from '../../db/schema'
import { eq } from 'drizzle-orm'

export class DbSessionStore extends Store {
  constructor(private db: PostgresJsDatabase<typeof schema>) {
    super()
  }

  async get(sid, callback) {
    try {
      const result = await this.db
        .select()
        .from(schema.session)
        .where(eq(schema.session.id, sid))

      if (result.length === 0) return callback(null, null)

      return callback(null, {
        vendorId: result[0].vendor_id,
        cookie: {
          expires: new Date(result[0].expires_at),
        },
      })
    } catch (err) {
      callback(err)
    }
  }

  async set(sid, session, callback) {
    try {
      const expires = session.cookie.expires
        ? new Date(session.cookie.expires)
        : new Date(Date.now() + 1000 * 60 * 60 * 24)

      await this.db
        .insert(schema.session)
        .values({
          id: sid,
          vendor_id: session.vendorId,
          expires_at: expires,
        })
        .onConflictDoUpdate({
          target: schema.session.id,
          set: {
            vendor_id: session.vendorId,
            expires_at: expires,
          },
        })

      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }

  async destroy(sid, callback) {
    try {
      await this.db.delete(schema.session).where(eq(schema.session.id, sid))
      callback?.()
    } catch (err) {
      callback?.(err)
    }
  }
}
