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

let createdRooms: string[] = [];

@ApiTags("채팅방 socket.io")
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

    this.logger.log("웹소켓 서버 초기화 ✅");
  }

  //<<------------소켓연결------------>>

  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결`);
  }

  //<<------------소켓 연결 해제------------>>
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`${socket.id} 소켓 연결 해제 ❌`);
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
        .emit("message", { username: socket.id, message });
    }
    return { username: socket.id, message };
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
    @MessageBody() { roomName }: { roomName: string }
  ) {
    // const exists = createdRooms.find((createdRoom) => createdRoom === roomName);
    // if (exists) {
    //   return { success: false, payload: `${roomName} 방이 이미 존재합니다.` };
    // }

    const chatRoom = this.groupChatService.createRoom(roomName);
    if (chatRoom) {
      socket.join(roomName); // 기존에 없던 room으로 join하면 room이 생성됨
      createdRooms.push(roomName); // 유저가 생성한 room 목록에 추가
      this.nsp.emit("create-room", roomName); // 대기실 방 생성
      return { success: true, payload: roomName };
    }
    return { success: false, payload: "방 생성에 실패했습니다." };
  }

  //<<------------방 참여------------>>
  @SubscribeMessage("join-room")
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string
  ) {
    {
      try {
        const response = await this.groupChatService.joinRoom(
          roomName,
          socket.id
        );
        socket.join(roomName);
        socket.broadcast
          .to(roomName)
          .emit("message", { message: `${socket.id}가 들어왔습니다.` });

        return { success: true, message: response };
      } catch (error) {
        return { success: false, message: error.message };
      }
    }
  }

  //<<------------방 나가기------------>>
  @SubscribeMessage("leave-room")
  async handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string
  ) {
    try {
      const response = await this.groupChatService.leaveRoom(
        roomName,
        socket.id
      );
      socket.leave(roomName);
      socket.broadcast
        .to(roomName)
        .emit("message", { message: `${socket.id}가 나갔습니다.` });

      return { success: true, message: response };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}
