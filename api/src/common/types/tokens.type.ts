export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface RequestUser {
  userId: string;
  email: string;
}