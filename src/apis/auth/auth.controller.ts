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
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PhoneService } from "src/common/phone/pohone.services";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import { UsersService } from "../users/users.service";
import { checkSms, sendPhone } from "./dto/sendPhone.dto";

@Controller("auth")
@ApiTags("인증 API")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneService: PhoneService,
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

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

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.authService.remove(+id);
  }
}
