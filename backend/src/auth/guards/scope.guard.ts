import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPE_KEY } from '../decorators/scope.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserPermissionService } from '../../user/user-permission.service';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userPermissionService: UserPermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const requiredScopes = this.reflector.getAllAndOverride<string[]>(SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied: missing authentication context');
    }

    // 1. Super Admin bypasses all scope checks
    if (this.userPermissionService.isGlobalRole(user.role.name)) {
      return true;
    }

    // 2. Global scope allows access
    if (requiredScopes.includes('global')) {
      return true;
    }

    // Extract resource properties from body, query, then params
    const requestDepartmentId =
      request.body?.departmentId ||
      request.query?.departmentId ||
      request.params?.departmentId;

    const requestBuildingId =
      request.body?.buildingId ||
      request.query?.buildingId ||
      request.params?.buildingId;

    const checkDepartment = requiredScopes.includes('department');
    const checkBuilding = requiredScopes.includes('building');

    // 3. Department Scope check
    if (checkDepartment) {
      if (!requestDepartmentId) {
        throw new ForbiddenException('Access denied: missing department resource context');
      }
      if (!this.userPermissionService.hasDepartmentScope(user, requestDepartmentId)) {
        throw new ForbiddenException('Access denied: department scope mismatch');
      }
    }

    // 4. Building Scope check
    if (checkBuilding) {
      if (!requestBuildingId) {
        throw new ForbiddenException('Access denied: missing building resource context');
      }
      if (!this.userPermissionService.hasBuildingScope(user, requestBuildingId)) {
        throw new ForbiddenException('Access denied: building scope mismatch');
      }
    }

    return true;
  }
}
