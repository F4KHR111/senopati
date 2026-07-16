import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserSummaryDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('User account is disabled');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const userSummary: UserSummaryDto = {
      id: user.id,
      username: user.username,
      name: user.employee?.employee_name || user.username,
      role: user.role.name,
      departmentId: user.employee?.department_id || null,
      buildingId: user.building_id,
    };

    return {
      accessToken,
      expiresIn,
      user: userSummary,
    };
  }
}
