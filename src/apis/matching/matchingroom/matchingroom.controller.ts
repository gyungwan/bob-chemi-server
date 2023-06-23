import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "src/apis/users/users.service";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { CreateCheckInfoDto } from "./dto/create-checkInfo.dto";
import { MatchingRoom } from "./entities/matchingroom.entity";
import { MatchingRoomService } from "./matchingroom.service";

@ApiTags("매칭룸 API")
@Controller("matchingRoom")
export class MatchingRoomController {
  constructor(
    private readonly matchingRoomService: MatchingRoomService,
    private readonly usersService: UsersService
  ) {}

  //----------------- 매칭 성사-----------------------//
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭 요청" })
  async checkInfoForMatching(
    @Body() createCheckInfoDto: CreateCheckInfoDto,
    @Req() req: Request
  ): Promise<MatchingRoom> {
    // 퀵매칭 id 로 퀵매칭 가져오기 (dto)
    const userId = (req.user as any).id;
    const user = await this.usersService.findOneId(userId);
    const myGender = user.gender;
    const myAge = user.age;
    const myAgeGroup = this.getAgeGroup(myAge);
    const { targetGender, targetAgeGroup, quickMatchingId } =
      createCheckInfoDto;
    const matchingRoom = await this.matchingRoomService.checkMatching({
      userId,
      myGender,
      myAgeGroup,
      targetGender,
      targetAgeGroup,
      quickMatchingId,
    });
    console.log("==========================================");
    console.log(
      user,
      myGender,
      myAgeGroup,
      targetGender,
      targetAgeGroup,
      quickMatchingId,
      matchingRoom
    );
    return matchingRoom;
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
  //----------------- 매칭된 상대방 유저 정보 조회 -----------------------//
  // 매칭된 유저의 정보 확인할 수 있도록
  @Get(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭된 상대방 유저 정보 조회 " })
  async fetchQuickMatching(@Param("id") id: string) {
    return this.matchingRoomService.findTargetUser(id);
  }

  //----------------- 유저가 매칭 거절 -----------------------//

  //if(isMatched == false){}
  // else if(isMatched == true){}
  //----------------- 매칭룸에서 제거(시간 제한)-----------------------//
  // 대기 시간 설정 메서드
  // setWaitingTime(waitingHours: number) {
  //   this.waitingStart = new Date();  // 대기 시작 시간을 현재 시간으로 설정
  //   this.waitingEnd = new Date();
  //   this.waitingEnd.setHours(this.waitingEnd.getHours() + waitingHours);  // 대기 시작 시간으로부터 대기 시간만큼 추가하여 대기 종료 시간 설정
  // }
}
