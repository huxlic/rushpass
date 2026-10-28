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
  private matchRoles(roles: string[], role: string) {
    if (!roles.includes(role)) {
      throw new UnauthorizedException('Admin access denied for this action', {
        errorCode: 'UNAUTHORIZED',
      });
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const role = request.headers['role'];

    if (!role || typeof role !== 'string') return false;
    this.matchRoles(roles, role);
    return true;
  }
}
