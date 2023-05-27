import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

export class jwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
    });
  }
  validate(payload) {
    console.log(payload);
    return {
      id: payload.id,
      email: payload.email,
    };
  }
}
