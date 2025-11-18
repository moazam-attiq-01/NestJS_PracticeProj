import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Vendor = createParamDecorator(
  (data: keyof { id: number; email: string; username: string } | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>()
    const vendor = req.session.vendor

    if (!vendor) {
      return null
    }
    return data ? vendor[data] : vendor
  },
)
