import { ExceptionFilter } from '@nestjs/common';
export declare class PostgresExceptionFilter implements ExceptionFilter {
    catch(exception: unknown): void;
}
