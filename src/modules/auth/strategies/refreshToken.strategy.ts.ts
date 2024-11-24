import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { refreshJwtStrategyConfig } from '@/config/jwt.config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super(refreshJwtStrategyConfig);
  }

  validate(req: Request, payload: any) {
    const authorizationHeader = req.get('Authorization');
    if (!authorizationHeader) {
      throw new Error('Authorization header is missing');
    }
    const refreshToken = authorizationHeader.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
