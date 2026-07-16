import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserPermissionService {
  private permissionCache = new Map<string, string[]>();

  constructor(private prisma: PrismaService) {}

  async getPermissionsForRole(roleId: string): Promise<string[]> {
    if (this.permissionCache.has(roleId)) {
      return this.permissionCache.get(roleId)!;
    }

    const mappings = await this.prisma.rolePermission.findMany({
      where: { role_id: roleId },
      include: {
        permission: true,
      },
    });

    const permissions = mappings.map(
      (m) => `${m.permission.module}.${m.permission.action}`,
    );

    this.permissionCache.set(roleId, permissions);
    return permissions;
  }

  clearCache() {
    this.permissionCache.clear();
  }
}
