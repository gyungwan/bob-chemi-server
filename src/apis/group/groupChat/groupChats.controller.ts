import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GroupChatService } from "./groupChats.service";

@Controller("groupChat")
@ApiTags("소모임 채팅방 API")
export class GroupChatController {
  constructor(private readonly groupChatService: GroupChatService) {}
  //<<------------d------------>>

  //<<------------단체 채팅방 조회------------>>
  @Get(":roomId")
  getChatRoom(@Param("roomId") chatRoomId: string) {
    return this.groupChatService.getChatRoom(chatRoomId);
  }

  //<<------------채팅방 개설----------->>
  @Post(":chatRoomId/create")
  createChatRoom(@Param("chatRoomId") chatRoomId: string) {
    this.groupChatService.createChatRoom(chatRoomId);
  }

  //<<------------채팅방 참여------------>>
  @Post(":chatRoomId/join")
  joinChatRoom(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string
  ) {
    this.groupChatService.joinChatRoom(chatRoomId, user);
  }

  //<<------------채팅방 나가기------------>>
  @Post(":chatRoomId/leave")
  leaveChatRoom(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string
  ) {
    this.groupChatService.leaveChatRoom(chatRoomId, user);
  }

  //<<------------채팅 보내기------------>>
  @Post(":chatRoomId/send")
  sendMessage(
    @Param("chatRoomId") chatRoomId: string,
    @Body("user") user: string,
    @Body("message") message: string
  ) {
    this.groupChatService.sendMessage(chatRoomId, user, message);
  }
}
