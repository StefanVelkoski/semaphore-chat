import { JwtPayload } from 'jsonwebtoken';

export interface AuthUser {
  hashedTwitterId?: string;
}

export interface MyJwtPayload extends JwtPayload, AuthUser {}
