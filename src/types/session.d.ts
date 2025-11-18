import 'express-session'

declare module 'express-session' {
  interface SessionData {
    vendor?: { id: number; email: string; username: string }
  }
}

interface AuthenticatedRequest extends Request {
  session: {
    vendor: {
      id: number
      email: string
      username: string
    }
  }
}
