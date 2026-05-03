import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get required roles from @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // if no roles are set → allow access
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

     if (!user) {
      throw new ForbiddenException('Please log in first');
    }

    // user must exist (comes from JwtAuthGuard)
    if (!user) return false;

    const isAllowed= requiredRoles.includes(user.role);

    if (!isAllowed) {
      throw new ForbiddenException('Only ADMIN can access this resource');
    }
    return true;
  }
}