import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, UserSummaryDto } from './dto/login-response.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  private parseDuration(duration: string): number {
    const match = duration.match(/^(\d+)([dmhs])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // default 7 days
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
      case 'd': return value * 24 * 60 * 60 * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 's': return value * 1000;
      default: return 7 * 24 * 60 * 60 * 1000;
    }
  }

  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<LoginResponseDto> {
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

    const payload = {
      sub: user.id,
      username: user.username,
      roleId: user.role_id,
      departmentId: user.employee?.department_id || null,
      buildingId: user.building_id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const refreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { expiresIn: refreshExpiresIn as any },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + this.parseDuration(refreshExpiresIn));

    await this.prisma.session.create({
      data: {
        userId: user.id,
        refreshTokenHash,
        ipAddress: ipAddress || null,
        userAgent: userAgent || null,
        expiresAt,
      },
    });

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
      refreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
      user: userSummary,
    };
  }

  async refresh(refreshTokenDto: RefreshTokenDto, ipAddress?: string, userAgent?: string): Promise<RefreshResponseDto> {
    const { refreshToken } = refreshTokenDto;
    let decoded: any;

    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userId = decoded.sub;
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        expiresAt: { gt: new Date() },
        deletedAt: null,
      },
    });

    let matchedSession = null;
    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash);
      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(userId);
    if (!user || !user.is_active) {
      throw new UnauthorizedException('User not found or disabled');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      roleId: user.role_id,
      departmentId: user.employee?.department_id || null,
      buildingId: user.building_id,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    const newRefreshToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      { expiresIn: refreshExpiresIn as any },
    );

    const newHash = await bcrypt.hash(newRefreshToken, 10);
    const newExpiresAt = new Date(Date.now() + this.parseDuration(refreshExpiresIn));

    await this.prisma.session.update({
      where: { id: matchedSession.id },
      data: {
        refreshTokenHash: newHash,
        expiresAt: newExpiresAt,
        lastUsedAt: new Date(),
        ipAddress: ipAddress || matchedSession.ipAddress,
        userAgent: userAgent || matchedSession.userAgent,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };
  }

  async logout(logoutDto: LogoutDto): Promise<{ success: boolean }> {
    const { refreshToken } = logoutDto;
    let decoded: any;

    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const userId = decoded.sub;
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        deletedAt: null,
      },
    });

    let matchedSession = null;
    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.refreshTokenHash);
      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    await this.prisma.session.update({
      where: { id: matchedSession.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { success: true };
  }
}
