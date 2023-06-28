import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatRoom } from "./entities/chatRooms.entity";
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
  createRoom(@Body("roomName") roomName: string): any {
    const room = this.groupChatService.createRoom(roomName);
    return room;
  }

  //<<------------방 조회------------>>
  @ApiOperation({
    summary: "모든 채팅방 조회",
    description: "모든 채팅방 개설",
  })
  @Get("room")
  getRooms(): Promise<ChatRoom[]> {
    return this.groupChatService.getRooms();
  }

  //<<------------방 검색------------>>
  @ApiOperation({
    summary: "채팅방 ID로 채팅방 검색",
    description: "ID로 채팅방 검색",
  })
  @Get("room/:chatRoomId")
  getRoom(@Param("chatRoomId") chatRoomId: string): Promise<ChatRoom> {
    return this.groupChatService.findRoom(chatRoomId);
  }

  //<<------------방 참여------------>>
  @ApiOperation({
    summary: "채팅방 참여",
    description: "채팅방 ID와 유저ID로 참여",
  })
  @Post("join")
  joinRoom(
    @Body("chatRoomId") chatRoomId: string,
    @Body("userId") userId: string
  ): Promise<string> {
    return this.groupChatService.joinRoom(chatRoomId, userId);
  }

  //<<------------방 나가기------------>>
  @ApiOperation({
    summary: "채팅방 나가기",
    description: "채팅방ID와 유저ID로 채팅방 나가기",
  })
  @Delete("leave/:chatRoomId/:userId")
  leaveRoom(
    @Param("chatRoomId") chatRoomId: string,
    @Param("userId") userId: string
  ): Promise<boolean> {
    return this.groupChatService.leaveRoom(chatRoomId, userId);
  }

  //<<------------방 삭제------------>>
  @ApiOperation({
    summary: "채팅방 삭제",
    description: "채팅방 삭제",
  })
  @Delete("delete/:chatRoomId")
  deleteRoom(@Param("chatRoomId") chatRoomId: string): Promise<boolean> {
    return this.groupChatService.deleteRoom(chatRoomId);
  }

  //<<------------채팅 보내기------------>>
  @ApiOperation({
    summary: "채팅 발송",
    description: "채팅 발송",
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
