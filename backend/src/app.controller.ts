import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './auth/decorators/roles.decorator';
import { Permissions } from './auth/decorators/permissions.decorator';
import { CurrentUser } from './auth/decorators/current-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@CurrentUser() user: any): string {
    return this.appService.getHello() + (user ? ` (User: ${user.username})` : '');
  }

  @Get('test-role')
  @Roles('PJ Benda Seni')
  testRole(): string {
    return 'role success';
  }

  @Get('test-permission')
  @Permissions('art.read')
  testPermission(): string {
    return 'permission success';
  }

  @Get('test-role-forbidden')
  @Roles('Tata Usaha')
  testRoleForbidden(): string {
    return 'should be blocked';
  }

  @Get('test-permission-forbidden')
  @Permissions('user.create')
  testPermissionForbidden(): string {
    return 'should be blocked';
  }
}
