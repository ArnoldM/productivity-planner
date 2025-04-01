export interface LoginResponse {
  jwtToken: string;
  jwtRefreshToken: string;
  expiresIn: string;
  userId: string;
  isRegistered: boolean;
}
