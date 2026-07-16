import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserPermissionService } from './user-permission.service';

@Module({
  providers: [UserService, UserPermissionService],
  exports: [UserService, UserPermissionService],
})
export class UserModule {}
