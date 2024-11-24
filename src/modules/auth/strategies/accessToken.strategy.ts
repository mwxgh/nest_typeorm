import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { JwtStrategyDto } from "../dto";
import { jwtStrategyConfig } from "@/config/jwt.config";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super(jwtStrategyConfig);
  }

  validate(payload: JwtStrategyDto) {
    return payload;
  }
}
