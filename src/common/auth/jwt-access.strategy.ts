import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Payload } from "../utils/jwt-interface";

export class jwtAccessStrategy extends PassportStrategy(Strategy, "access") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "myAccessKey",
    });
  }
  validate(payload: Payload) {
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
