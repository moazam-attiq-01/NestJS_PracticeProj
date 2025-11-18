import { Response } from 'express'
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    console.log('exception in backend', exception)
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const res = exception.getResponse()
      return response.status(status).json(res)
    }

    // fallback for unexpected errors
    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
}
