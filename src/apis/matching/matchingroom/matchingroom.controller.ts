import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "src/apis/users/users.service";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
import { MatchingRoom } from "./entities/matchingroom.entity";
import { MatchingRoomService } from "./matchingroom.service";
// import { MatchingRoomService } from "./matchingroom.service";

//@ApiTags("매칭룸 API")
@Controller("matchingRoom")
export class MatchingRoomController {
  constructor(
    private readonly matchingRoomService: MatchingRoomService,
    private readonly usersService: UsersService,
    private readonly quickMatchingService: QuickMatchingService
  ) {}

  //----------------- 매칭된 상대방 유저 정보 조회 -----------------------//
  // 매칭된 유저의 정보 확인할 수 있도록
  // 수정하기
  @Get(":id") // 매칭룸아이디
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "매칭된 상대방 유저 정보 조회 " })
  async getTargetUserInfo(@Param("id") matchingRoomId: string) {
    return this.quickMatchingService.findOne(matchingRoomId);
  }
}
