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
    @Body() createQuickingDto: CreateQuickMatchingDto,
    @Req() req: Request
  ): Promise<QuickMatching[]> {
    const { targetGender, targetAgeGroup } = createQuickingDto;
    // console.log("==============================", targetGender, targetAgeGroup);
    const userId = (req.user as any).id;
    const user = await this.usersService.findOneId(userId); // 내정보

    const myGender = user.gender; // 이미 user안에 gender가 있으니까..
    const myAge = user.age;
    const myAgeGroup = this.getAgeGroup(myAge);

    //console.log(user, myAge, myAgeGroup, userId); // 상대방의 정보 출력
    return this.quickMatchingService.create(userId, {
      targetGender: createQuickingDto.targetGender,
      targetAgeGroup: createQuickingDto.targetAgeGroup,
    }); //
  }

  getAgeGroup(age: number): string {
    if (age >= 10 && age <= 19) {
      return "TEENAGER";
    } else if (age >= 20 && age <= 29) {
      return "TWENTIES";
    } else if (age >= 30 && age <= 39) {
      return "THIRTIES";
    } else if (age >= 40 && age <= 49) {
      return "FORTIES";
    } else if (age >= 50 && age <= 59) {
      return "FIFTIES";
    } else {
      return "기타";
    }
  }

  //----------------- 모든 매칭 요처 조회-----------------------//
  @Get() // 퀵매칭 아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "모든 매칭 요청 조회" })
  async getQuickMatching() {
    return this.quickMatchingService.findAllRequestMatching();
  }

  //----------------- 유저의 매칭 요청 조회-----------------------//

  @Get(":id") // 퀵매칭 아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "유저의 매칭 요청 조회" })
  async fetchQuickMatching(@Param("id") id: string) {
    return this.quickMatchingService.findRequestMatching(id);
  }

  //----------------- 매칭 전 취소, 거절  -----------------------//
  @Delete(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 전 취소, 매칭 알림 후 거절" })
  async cancleMatching(@Param("id") id: string) {
    return this.quickMatchingService.cancel(id);
  }
}
