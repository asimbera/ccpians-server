import { Request } from 'express';

export interface JWTPayload {
  id: number;
  scope: string;
}

export interface Context {
  user?: JWTPayload;
}

export interface ExtendedRequest extends Request {
  user?: JWTPayload;
}
