import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'fallback_secret',
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }
    if (!user.is_active) {
      throw new UnauthorizedException('User account is disabled');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role_id: user.role_id,
      role: user.role,
      departmentId: user.employee?.department_id || null,
      buildingId: user.building_id,
    };
  }
}
