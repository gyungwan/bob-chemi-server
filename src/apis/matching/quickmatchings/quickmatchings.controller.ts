import {
  BadRequestException,
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
import { UsersService } from "../../users/users.service";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import { QuickMatching } from "./entities/quickmatchings.entity";
import { QuickMatchingService } from "./quickmatchings.service";

@ApiTags("퀵매칭 API")
@Controller("quickMatching")
export class QuickMatchingController {
  constructor(
    private readonly quickMatchingService: QuickMatchingService,
    private readonly usersService: UsersService
  ) {}

  //----------------- 매칭 요청 -----------------------//
  // 나의 정보와 내가 원하는 조건만 넘어가도록
  // 나의 정보를 조건처럼 가공해서 넘겨주기
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 요청" })
  async requestQuickMatching(
    @Body() { gender, ageGroup }: CreateQuickMatchingDto,
    @Req() req: Request
  ): Promise<QuickMatching> {
    console.log("==============================");
    const userId = (req.user as any).id;
    const user = await this.usersService.findOneId(userId); // 내정보

    const myGender = user.gender; // 이미 user안에 gender가 있으니까..
    const myAge = user.age;
    const myAgeGroup = this.getAgeGroup(myAge);

    console.log(user, myAge, myAgeGroup); // 상대방의 정보 출력
    return this.quickMatchingService.create(userId, { gender, ageGroup });
  }

  getAgeGroup(age: number): string {
    if (age >= 10 && age <= 19) {
      return "10대";
    } else if (age >= 20 && age <= 29) {
      return "20대";
    } else if (age >= 30 && age <= 39) {
      return "30대";
    } else if (age >= 40 && age <= 49) {
      return "40대";
    } else if (age >= 50 && age <= 59) {
      return "50대";
    } else {
      return "기타";
    }
  }
  //----------------- 유저의 매칭 결과 조회 -----------------------//
  // 매칭된 유저의 정보 확인할 수 있도록
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

  //----------------- 매칭 거절  -----------------------//

  //----------------- 매칭 수락  -----------------------//
}
