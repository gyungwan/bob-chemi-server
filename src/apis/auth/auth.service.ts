import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser({ loginDto }) {
    const user = await this.usersService.findOneEmail({
      email: loginDto.email,
    });
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
    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: process.env.JWT_REFRESH_KEY, expiresIn: "2w" }
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Set-Cookie", `myRefreshKey=${refreshToken}`);
    return;
  }

  async getAccesstoken({ user }) {
    // const token = this.jwtService.sign(
    //   { email: user.email }, //
    //   { secret: "myAccessKey", expiresIn: "1h" }
    // );
    // return this.jwtService.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //     nickname: user.nickname,
    //     name: user.name,
    //     gender: user.gender,
    //     age: user.age,
    //   }, //
    //   { secret: "myAccessKey", expiresIn: "1h" }
    // );
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

  findAll() {
    return `This action returns all auth`;
  }

  findOne(email: string) {
    return `This action returns a #${email} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
