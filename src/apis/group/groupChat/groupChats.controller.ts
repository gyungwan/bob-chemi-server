import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { GroupChatService } from "./groupChats.service";

@Controller("groupChat")
export class GroupChatsController {
  constructor(private readonly groupChatService: GroupChatService) {}

  //<<------------방 생성------------>>
  @Post("room")
  createRoom(@Body() roomName: string): any {
    const room = this.groupChatService.createRoom(roomName);
    return { success: !!room, payload: room };
  }

  //<<------------방 조회------------>>
  @Get("room")
  getRooms(): ChatRoom[] {
    return this.groupChatService.getRooms();
  }

  //<<------------방 검색------------>>
  @Get("room/:roomName")
  getRoom(@Param("roomName") roomName: string): ChatRoom {
    return this.groupChatService.findRoom(roomName);
  }

  //<<------------채팅 발송------------>>
  @Post("room/:roomName/chats")
  addChat(
    @Param("roomName") roomName: string,
    @Body() { message }: { message: string }
  ): any {
    const chat = this.groupChatService.addChat(roomName, message);
    return { success: !!chat, payload: chat };
  }
}
