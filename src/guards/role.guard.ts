import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Roles } from '../common/decorators/roles.decorator.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) return true;
    
    const request: Request = context.switchToHttp().getRequest();
    const role = request.headers["role"];
    
    if (!role || roles[0] !== role) throw new UnauthorizedException(
      'You are not allowed to perform this action.',
    );
    
    return true;
  }
}
