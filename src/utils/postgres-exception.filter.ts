import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common'

@Catch(Error)
export class PostgresExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    const error = exception instanceof Error ? exception : new Error(String(exception))

    // Duplicate key (unique constraint)
    if (error.message.includes('duplicate key')) {
      throw new BadRequestException('A record with these values already exists.')
    }

    // Not-null constraint violation
    if (error.message.includes('violates not-null constraint')) {
      throw new BadRequestException('A required field was missing.')
    }

    throw error
  }
}
