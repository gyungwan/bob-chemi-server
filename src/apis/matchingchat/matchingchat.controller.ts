import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingChatService } from "./matchingchat.service";

@ApiTags("MATCHINGCHAT")
@Controller("matchingchat")
export class MatchingChatController {
  constructor(private readonly matchingChatService: MatchingChatService) {}
  //----------------- 모든 채팅 조회 -----------------------//
  @Get()
  @ApiOperation({
    summary: "모든 채팅 조회",
  })
  // @ApiNotFoundResponse({
  //   type: ReviewError,
  //   description: "존재하지 않는 이메일입니다.",
  // })
  async getChats(): // @Query("page") page: number = 1,
  // @Query("order") order: string = "DESC"
  Promise<MatchingChat[]> {
    return this.matchingChatService.getAllChatLogs(); //{page,order}
  }
  //----------------- 유저의 채팅 조회 -----------------------//
  @Get(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "유저의 채팅 조회",
  })
  async getUserChat(
    @Request() request: any,
    @Param("id") id: string
  ): Promise<MatchingChat[]> {
    const userId = request.user.id;
    return this.matchingChatService.getUserChatLogs(userId);
  }

  //----------------- 유저의 채팅방의 채팅 조회 -----------------------//
  @Get(":roomId")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "유저 채팅방의 채팅 조회",
  })
  async getChatByRoomId(
    @Request() request: any,
    @Param("roomId") roomId: string
  ): Promise<MatchingChat[]> {
    const userId = request.user.id;
    return this.matchingChatService.checkChatByRoomId(userId, roomId);
  }

  //-----------------채팅방 나가기-----------------------//
  @Delete(":roomId/leave")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "채팅방 나가기" })
  async leaveRoom(
    @Request() request: any,
    @Param("roomId") roomId: string
  ): Promise<void> {
    const userId = request.user.id;
    await this.matchingChatService.leaveChatRoom(userId, roomId);
  }
}
