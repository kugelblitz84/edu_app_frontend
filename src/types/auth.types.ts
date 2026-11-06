export type UserRole = 'STUDENT' | 'CREATOR' | 'INSTITUTION_ADMIN' | 'GLOBAL_ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string | null;
  institutionId?: string | null;
  institutionName?: string | null;
  bio?: string;
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

