import 'express-session'

declare module 'express-session' {
  interface SessionData {
    vendorId?: number;
    vendor?: {
      id: number;
      email: string;
      username: string;
    }
  }
}
