import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { GroupChatService } from "./groupChats.service";

@Controller("groupChat")
@ApiTags("채팅방 API")
export class GroupChatsController {
  constructor(private readonly groupChatService: GroupChatService) {}

  //<<------------방 생성------------>>

  @ApiOperation({
    summary: "채팅방 개설",
    description: "채팅방 개설",
  })
  @Post("room")
  createRoom(@Body() roomName: string): any {
    const room = this.groupChatService.createRoom(roomName);
    return { success: !!room, payload: room };
  }

  //<<------------방 조회------------>>
  @ApiOperation({
    summary: "모든 채팅방 조회",
    description: "모든 채팅방 개설",
  })
  @Get("room")
  getRooms(): ChatRoom[] {
    return this.groupChatService.getRooms();
  }

  //<<------------방 검색------------>>
  @ApiOperation({
    summary: "채팅방 ID로 채팅방 검색",
    description: "ID로 채팅방 검색",
  })
  @Get("room/:chatRoomId")
  getRoom(@Param("chatRoomId") chatRoomId: string): ChatRoom {
    return this.groupChatService.findRoom(chatRoomId);
  }

  //<<------------방 참여------------>>
  //<<------------방 나가기------------>>
  //<<------------방 삭제------------>>

  //<<------------채팅 보내기------------>>
  @ApiOperation({
    summary: "채팅 발송",
    description: "채팅방 개설",
  })
  @Post("room/:chatRoomId/:userId/chats")
  addChat(
    @Param("chatRoomId") chatRoomId: string,
    @Param("userId") userId: string,
    @Body() { message }: { message: string }
  ): any {
    const chat = this.groupChatService.addChat(chatRoomId, message, userId);
    return { success: !!chat, payload: chat };
  }
}
