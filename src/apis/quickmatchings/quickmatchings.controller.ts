import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { UsersService } from "../users/users.service";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import { QuickMatching } from "./entities/quickmatchings.entity";
import { QuickMatchingService } from "./quickmatchings.service";

@ApiTags("퀵매칭 API")
@Controller("quick-matching")
export class QuickMatchingController {
  constructor(
    private readonly quickMatchingService: QuickMatchingService,
    private readonly usersService: UsersService
  ) {}

  //----------------- 매칭 요청 -----------------------//
  //gender, ageGroup
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 요청" })
  async createQuickMatching(
    @Body() createQuickMatchingDto: CreateQuickMatchingDto,
    @Req() req: Request
  ): Promise<QuickMatching> {
    // const userId = (req.user as any).id;
    const userId = (req.user as any).id;
    const user = await this.usersService.findOneEmail(userId);
    console.log(userId, "======================================");
    // const myGender = user.gender;
    // const myAge = req.user.age;
    return this.quickMatchingService.create(createQuickMatchingDto);
  }

  //----------------- 유저의 매칭 결과 조회 -----------------------//
  @Get(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "유저의 매칭 결과 조회" })
  async fetchQuickMatching(@Param("id") id: string) {
    return this.quickMatchingService.findOne(id);
  }

  //----------------- 매칭 취소  -----------------------//
  @Delete(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "유저의 매칭 취소" })
  async cancleMatching(@Param("id") id: string) {
    return this.quickMatchingService.cancel(id);
  }
}
