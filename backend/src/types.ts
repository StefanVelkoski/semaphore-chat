import { JwtPayload } from 'jsonwebtoken';

export interface RequestUserPayload {
  hashedTwitterId: string;
  _id: string;
}

export interface MyJwtPayload extends JwtPayload, RequestUserPayload {}
