import { Logger } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Namespace, Socket } from "socket.io";
import { GroupChatService } from "./groupChats.service";

interface MessagePayload {
  chatRoomId: string;
  userId: string;
  message: string;
}

interface UserPayload {
  chatRoomId: string;
}

let createdRooms: string[] = [];

@WebSocketGateway({
  namespace: "groupChat",
  cors: { origin: "*" },
})
export class GroupChatsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger("Gateway");

  constructor(private readonly groupChatService: GroupChatService) {}

  @WebSocketServer() nsp: Namespace;

  afterInit() {
    this.nsp.adapter.on("delete-room", (room) => {
      const deletedRoom = createdRooms.find(
        (createdRoom) => createdRoom === room
      );
      if (!deletedRoom) return;
    });

    this.logger.log("웹소켓 서버 초기화✅");
  }

  //<<------------소켓연결------------>>
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`socketId : ${socket.id} 소켓 연결✅`);
  }

  //<<------------소켓 연결 해제------------>>
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`socketId : ${socket.id} 소켓 연결 해제 ❌`);
  }

  //<<------------방 조회------------>>
  @SubscribeMessage("room-list")
  handleRoomList() {
    return this.groupChatService.getRooms();
  }

  //<<------------방 생성------------>>
  @SubscribeMessage("create-room")
  handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string
  ) {
    const exists = createdRooms.find((createdRoom) => createdRoom === roomName);

    if (exists) {
      return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
    }

    const chatRoom = this.groupChatService.createRoom(roomName);
    if (chatRoom) {
      socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
      createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가
      this.nsp.emit("create-room", roomName); // 대기실 방 생성
      return { success: true, payload: chatRoom };
    }
    return { success: false, payload: "방 생성에 실패했습니다." };
  }

  //<<------------메세지 발송------------>>
  @SubscribeMessage("message")
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { chatRoomId, userId, message }: MessagePayload
  ) {
    const chat = this.groupChatService.addChat(chatRoomId, message, userId);

    if (chat) {
      socket.broadcast
        .to(chatRoomId)
        .emit("message", { userSocket: socket.id, message });
    }
    return { userSocket: socket.id, message };
  }

  //<<------------방 참여------------>>
  @SubscribeMessage("join-room")
  handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { chatRoomId }: UserPayload
  ) {
    {
      try {
        socket.join(chatRoomId);
        socket.broadcast
          .to(chatRoomId)
          .emit("message", { message: `${socket.id}님이 들어왔습니다.` });

        return { success: true, message: "참여 성공" };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  }

  //<<------------방 나가기------------>>
  @SubscribeMessage("leave-room")
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { chatRoomId }: UserPayload
  ) {
    try {
      socket.leave(chatRoomId);
      socket.broadcast
        .to(chatRoomId)
        .emit("message", { message: `${socket.id}가 나갔습니다.` });

      return { success: true, message: "나가기 성공" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
