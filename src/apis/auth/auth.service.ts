import {
  Injectable,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Response, Request } from "express";
import { Cache } from "cache-manager";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly accessJwtService: JwtService, // access 토큰을 위한 JwtService 인스턴스
    private readonly refreshJwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  async validateUser({ loginDto }) {
    const user = await this.usersService.findOneEmail(loginDto.email);
    if (!user) {
      throw new UnprocessableEntityException(
        "가입한 계정이 없거나 비밀번호가 올바르지 않습니다"
      );
    }
    const isAuth = await bcrypt.compare(loginDto.password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException(
        "가입한 계정이 없거나 비밀번호가 올바르지 않습니다"
      );
    }
    return user;
  }

  async setRefreshService({ res, user }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: "2w" }
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Set-Cookie", `myRefreshKey=${refreshToken}`);
    return;
  }

  async getAccesstoken({ user }) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        name: user.name,
        gender: user.gender,
        age: user.age,
      },
      { secret: process.env.JWT_ACCESS_KEY, expiresIn: "1h" }
    );

    return accessToken;
  }
  //완전히 구현 못함
  async logout({ res, req }) {
    const refreshToken = req.headers.cookie.replace("refreshToken=", "");
    const accessToken = req.headers.authorization.replace("Bearer ", "");

    console.log("refreshToken:", refreshToken);
    try {
      // const decodedAccess = jwt.verify(
      //   accessToken,
      //   process.env.JWT_ACCESS_KEY
      // ) as jwt.JwtPayload;

      // const decodedRefresh = jwt.verify(
      //   refreshToken,
      //   process.env.JWT_REFRESH_KEY
      // ) as jwt.JwtPayload;
      console.log("accessToken:", accessToken);
      const decodedAccess = this.accessJwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_KEY,
      }); // access 토큰 검증
      // const decodedRefresh = this.refreshJwtService.verify(refreshToken, {
      //   secret: process.env.JWT_REFRESH_KEY,
      // }); // refresh 토큰 검증

      const accessTokenExpiration = decodedAccess.exp;
      // const refreshTokenExpiration = decodedRefresh.exp;

      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간 (UTC 기준)

      if (
        accessTokenExpiration < currentTime
        // refreshTokenExpiration < currentTime
      ) {
        throw new UnauthorizedException("유효하지 않은 토큰입니다.");
      }

      // await this.cacheManager.set(
      //   `access_token:${accessToken}`,
      //   "accessToken",
      //   decodedAccess.exp
      // );

      // await this.cacheManager.set(
      //   `refresh_token:${refreshToken}`,
      //   "refreshToken",
      //   decodedRefresh.exp
      // );
    } catch (error) {
      console.error("Error during logout:", error);
      throw new UnauthorizedException("유효하지 않은 토큰입니다.");
    }

    res.setHeader("Set-Cookie", [`refreshToken=; HttpOnly; Path=/; Max-Age=0`]);
    return { message: "로그아웃에 성공하였습니다." };
  }
}
