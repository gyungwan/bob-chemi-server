import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { ChatRoomsService } from "./groupChats.service";

@Controller("groupChat")
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  //<<------------단체 채팅방 조회------------>>
  @Get(":roomId")
  getChatRoom(@Param("roomId") chatRoomId: string) {
    return this.chatRoomsService.getChatRoom(chatRoomId);
  }

  //<<------------채팅방 개설----------->>
  @Post(":chatRoomId/create")
  createChatRoom(@Param("chatRoomId") chatRoomId: string) {
    this.chatRoomsService.createChatRoom(chatRoomId);
  }

  //<<------------채팅방 참여------------>>
  @Post(":chatRoomId/join")
  joinChatRoom(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string
  ) {
    this.chatRoomsService.joinChatRoom(chatRoomId, user);
  }

  //<<------------채팅방 나가기------------>>
  @Post(":chatRoomId/leave")
  leaveChatRoom(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string
  ) {
    this.chatRoomsService.leaveChatRoom(chatRoomId, user);
  }

  //<<------------채팅 보내기------------>>
  @Post(":chatRoomId/send")
  sendMessage(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string,
    @Body("message") message: string
  ) {
    this.chatRoomsService.sendMessage(chatRoomId, user, message);
  }
}
