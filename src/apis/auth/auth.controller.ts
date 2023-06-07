import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  CACHE_MANAGER,
  NotFoundException,
  UnprocessableEntityException,
  Res,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PhoneService } from "src/common/utils/pohone.services";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { UsersService } from "../users/users.service";
import { checkSms, sendPhone } from "./dto/sendPhone.dto";
import { loginDto } from "./dto/login.dto";
import { Response, Request } from "express";
// import * as cookieParser from "cookie-parser";

import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";

@Controller("auth")
@ApiTags("인증 API")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneService: PhoneService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  @Post("login")
  @ApiOperation({
    summary: "유저 로그인",
    description: "유저 로그인 API",
  })
  @ApiResponse({
    type: loginDto,
  })
  async login(
    @Body() loginDto: loginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validateUser({ loginDto });

    await this.authService.setRefreshService({ user, res });

    const accessToken = await this.authService.getAccesstoken({ user });
    console.log("ㅁㅁㅁㅁ", accessToken);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        nickname: user.nickname,
        name: user.name,
        gender: user.gender,
        age: user.age,
      },
    };
  }
  @UseGuards(RestAuthAccessGuard)
  @Post("logout")
  @ApiOperation({
    summary: "유저 로그아웃",
    description: "유저 로그아웃 API",
  })
  @ApiResponse({
    description: "로그아웃 성공 여부가 리턴됩니다",
    // type: LogoutResponseDto,
  })
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    try {
      // 로그아웃 로직 수행
      const result = await this.authService.logout({ req, res });

      // 로그아웃 성공 시 응답 반환
      return res.status(200).json(result);
    } catch (error) {
      // 예외 발생 시 에러 응답 반환
      return res.status(500).json({ error: error.message });
    }
  }

  @Post("sms")
  @ApiOperation({
    summary: "인증번호 발송",
    description: "유저 인증번호발송 API",
  })
  @ApiResponse({
    description: "발송 성공 여부가 리턴됩니다",
    //type: CreateUserResponseDto,
  })
  @ApiBody({ type: sendPhone })
  async sendSms(@Body() { phone }: { phone: string }) {
    try {
      await this.phoneService.checkPhone({ phone });

      const token = this.phoneService.createToken();

      const sendToken = await this.phoneService.sendsms({ phone, token });

      await this.cacheManager.set(phone, token.toString(), 180);

      this.cacheManager.get(phone).then((res) => console.log(res));

      return sendToken.status;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException("핸드폰 번호를 제대로 입력해주세요");
      }
    }
  }
  @Post("sms/check")
  @ApiOperation({
    summary: "인증번호 검증",
    description: "유저 인증번호검증 API",
  })
  @ApiResponse({
    description: "검증 성공 여부가 리턴됩니다",
    //type: CreateUserResponseDto,
  })
  @ApiBody({ type: checkSms })
  async checkSms(@Body() { phone, token }: { phone: string; token: string }) {
    try {
      const cachePhoneToken = await this.cacheManager.get(phone);
      if (cachePhoneToken === token) {
        return "인증이 완료 되었습니다!";
      }
      await this.cacheManager.set(phone, token, 180);

      this.cacheManager.get(phone).then((res) => console.log(res));
    } catch (err) {}
  }
}
