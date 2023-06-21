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
  //매칭 요청을 하면 나의 나이, 성별도 같이 넘어감
  // 모든 매칭이 DB에 저장되는 대신, 조건이 맞을 경우만 매칭, isMatched == true
  //gender, ageGroup
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 요청" })
  async createQuickMatching(
    @Body() createQuickMatchingDto: CreateQuickMatchingDto,
    @Req() req: Request
  ): Promise<QuickMatching> {
    const userId = (req.user as any).id;
    //const user = await this.usersService.findOneId(userId); // 내정보

    // const myGender = user.gender; // 이미 user안에 gender가 있으니까..
    // const myAge = user.age;
    // const myAgeGroup = this.getAgeGroup(myAge);

    //quickMatching.isMatched = isMatched; 서비스
    // if 내가 요청하는 상대방의 성별과 나이대 == 상대방이 요청하는 성별, 나이대
    // 매칭 해라
    //const { gender, ageGroup } = CreateQuickMatchingDto;
    // const myMatchingInfo = {
    //   // 나의 정보
    //   myGender,
    //   myAgeGroup,
    // };
    // createQuickMatchingDto,
    // user,
    // myAgeGroup
    return this.quickMatchingService.create(createQuickMatchingDto, userId);
    // const quickMatching = await this.quickMatchingService.create(
    //   { gender, ageGroup },
    //   myMatchingInfo
    // );
    // quickMatching.isMatched = true;
    // console.log(quickMatching, "33333333333333333");
    // if (gender == myGender && ageGroup == myAgeGroup) {
    //   //조건이 맞다면 매칭을 만들어라
    //   const quickMatching = await this.quickMatchingService.create(
    //     { gender, ageGroup },
    //     myMatchingInfo
    //   );
    //   quickMatching.isMatched = true;

    //   console.log(quickMatching, "33333333333333333");
    //   return quickMatching;
    // } else {
    //   throw new BadRequestException(
    //     "매칭 조건에 해당하는 유저가 존재하지 않습니다."
    //   );
    //   //return quickMatching;
    // }
    // console.log(user, myAge, "======================");
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
