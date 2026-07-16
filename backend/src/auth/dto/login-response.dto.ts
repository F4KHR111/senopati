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
  expiresIn: string;
  user: UserSummaryDto;
}
