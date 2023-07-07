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
import { Socket } from "socket.io";
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

  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 요청" })
  async requestQuickMatching(
    @Body() createQuickingDto: CreateQuickMatchingDto,
    @Req() req: Request
  ): Promise<QuickMatching[]> {
    const { targetGender, targetAgeGroup, location } = createQuickingDto;

    const userId = (req.user as any).id;
    const user = await this.usersService.findOneId(userId);

    const myGender = user.gender;
    const myAge = user.age;
    const myAgeGroup = this.getAgeGroup(myAge);

    return this.quickMatchingService.request(userId, {
      targetGender: createQuickingDto.targetGender,
      targetAgeGroup: createQuickingDto.targetAgeGroup,
      location: createQuickingDto.location,
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

  //----------------- 모든 매칭 요청 조회-----------------------//
  // @Get() // 퀵매칭 아이디
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "모든 매칭 요청 조회, 실사용 API X" })
  // async getAllQuickMatching() {
  //   return this.quickMatchingService.findAllRequestMatching();
  // }

  //----------------- 유저의 매칭 요청 조회-----------------------//

  @Get(":quickMatchingid") // 퀵매칭 아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "유저의 매칭 요청 조회" })
  async getQuickMatching(@Param("quickMatchingId") quickMatchingId: string) {
    return this.quickMatchingService.findRequestMatching(quickMatchingId);
  }

  //----------------- 매칭 전 취소, 거절  -----------------------//
  @Delete(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 전 취소" })
  async cancleMatching(@Param("id") id: string) {
    return this.quickMatchingService.cancel(id);
  }

  //----------------- 매칭 삭제  -----------------------//
  @Delete("/delete/:id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 삭제" })
  async deleteMatchingUser(@Param("id") matchingRoomId: string) {
    await this.quickMatchingService.delete(matchingRoomId);
    return { message: "매칭 삭제 완료" };
  }

  //----------------- 매칭된 상대방 유저 정보 조회 -----------------------//
  // 매칭된 유저의 정보 확인할 수 있도록
  // 수정하기
  @Get(":matchingRoomId/user1") // 매칭룸아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭된 상대방 유저 정보 조회 " })
  async getTargetUserInfo(@Param("matchingRoomId") matchingRoomId: string) {
    return this.quickMatchingService.findOne(matchingRoomId);
  }

  //----------------- 매칭 수락 -----------------------//
  // 수락을 하면 isMatched == true, db에 저장 , 매칭챗 생성
  //테스트 해보기
  // @Post("/:accept")
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "매칭 수락 " })
  // async acceptMatching(@Body("quickMatchingId") quickMatchingId: string) {
  //   //matchedUserId
  //   console.log("라우브");
  //   await this.matchingRoomService.accept(quickMatchingId);
  //   return { message: "매칭 수락" };
  // }
}
