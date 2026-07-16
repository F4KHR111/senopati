export class UserSummaryDto {
  id: string;
  username: string;
  name: string;
  role: string;
  departmentId: string | null;
  buildingId: string | null;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  user: UserSummaryDto;
}
