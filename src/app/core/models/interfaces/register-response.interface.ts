export interface RegisterResponse {
  jwtToken: string;
  jwtRefreshToken: string;
  expiresIn: string;
  userId: string;
}
