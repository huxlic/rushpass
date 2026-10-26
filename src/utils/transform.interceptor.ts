import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = response.statusCode;
    const message =
      this.reflector.get(ResponseMessage, context.getHandler()) ?? 'Success';

    return next.handle().pipe(
      map((data: T) => ({
        statusCode,
        message,
        data,
        meta: {
          timestamp: new Date().toISOString(),
        }
      })),
    );
  }
}
