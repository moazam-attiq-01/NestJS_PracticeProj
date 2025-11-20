import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Vendor = createParamDecorator(
  (data: 'id' | 'email' | 'username' | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const vendor = req.session.vendorId;    

    if (!vendor) return null;

    return vendor;
  },
);
