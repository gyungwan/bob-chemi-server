import { ConsoleLogger, forwardRef, Inject } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { InjectRepository } from "@nestjs/typeorm";
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
import { Socket, Server } from "socket.io";
import { UsersService } from "src/apis/users/users.service";
import { Repository } from "typeorm";
import { MatchingRoom } from "../matchingroom/entities/matchingroom.entity";

// import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { MatchingChat } from "../matchingchat/entities/matchingchat.entity";
import { MatchingChatService } from "../matchingchat/matchingchat.service";
import { User } from "src/apis/users/entities/user.entity";
// localhost:3000/match로 요청을 보내면 이 gateway가 작동한다.
@WebSocketGateway({
  cors: {
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",
      "https://modern-bears-fix.loca.lt",
      "211.225.153.38",
      // "https://price-crush-client.vercel.app",
    ],
  },
  namespace: "/match",
})
@ApiTags("1:1 채팅API ")
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(forwardRef(() => MatchingChatService))
    private readonly matchingChatService: MatchingChatService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>
  ) {}
  @WebSocketServer()
  server: Server;
  //post 부분에서 연결해서 클라이언트 소켓 아이디를 받아오고 그연결 된 상태에서 소켓아이디를 이용해서 매칭된 정보를 넘기고 하면 될거 같은데

  // 유저가 연결 되었을때
  async handleConnection(client: Socket, ...args: any[]) {
    // async handleConnection(user1Id: string, user2Id: string, chatRoomId: string) {
    // const email_obj = client.handshake.headers.cookie;
    // if (email_obj) {
    //   const { email } = JSON.parse(email_obj);
    //   await this.auctionService.joinMyAuctionRoom(client, email);
    // }

    // await this.auctionService.findMyAuctionRoom({ productId });
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage("test")
  async handleTest(
    @ConnectedSocket()
    client: Socket,
    @MessageBody() data: any
  ) {
    console.log("data: ", data);
    await this.matchingChatService.test(client, data);
    return data;
  }

  //유저의 연결이 해제되었을때
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // 두 명의 사용자가 일치했을 때
  //onUsersMatched는 두 유저가 매칭되었을 때 호출되는 함수입니다. 매칭된 유저들에게 'matched' 이벤트를 전송하고, 그 이벤트의 payload에는 매칭된 유저들이 가입해야 하는 채팅방의 ID를 포함시킵니다.
  onUsersMatched(user1Id: string, user2Id: string, chatRoomId: string) {
    // 두 사용자 모두에게 'matched' 이벤트를 내보냅니다.

    this.server.to(user1Id).emit("matched", { chatRoomId });
    this.server.to(user2Id).emit("matched", { chatRoomId });
  }
  //'join room'과 'leave room' 이벤트는 유저가 채팅방에 접속하거나 떠날 때 서버에서 받는 이벤트입니다. 각각의 이벤트에 대한 핸들러에서는 유저를 해당 채팅방에 추가하거나 제거합니다.
  @SubscribeMessage("joinRoom")
  //   @ApiOperation({ summary: 'Send a chat message' })
  async onJoinRoom(client: Socket, chatRoomId: string) {
    console.log(client, chatRoomId, "11111111111----");
    const matchingRoom = await this.matchingRoomRepository.findOne({
      where: { id: chatRoomId },
      relations: ["user1"],
    });
    if (!matchingRoom) {
      // Handle error: Matching room not found
      return "Handle error: Matching room not found";
    }

    const user1Id = matchingRoom.user1.id;
    const user2Id = matchingRoom.user2.id;
    console.log(chatRoomId, "-------------------");
    client.join(chatRoomId);
    client.emit("joined room", chatRoomId);

    // Inform the users that they are now connected
    // this.server.to(user1Id).emit("users connected");
    // this.server.to(user2Id).emit("users connected");

    this.onUsersMatched(user1Id, user2Id, chatRoomId);
  }

  @SubscribeMessage("leave room")
  async onLeaveRoom(client: Socket, chatRoomId: string) {
    client.leave(chatRoomId);
    client.emit("left room", chatRoomId);

    // 채팅방에서 나갔으므로 해당 채팅방의 메시지를 모두 삭제한다.
    await this.matchingChatService.deleteChatRoomMessages(chatRoomId);
  }

  @SubscribeMessage("message")
  async handleMessage(
    client: Socket,
    chatMessageData: { senderId: string; message: string; roomId: string }
  ) {
    const user = await this.userRepository.findOne({
      where: { id: chatMessageData.senderId },
    });
    const room = await this.matchingRoomRepository.findOne({
      where: { id: chatMessageData.roomId },
    });

    const newChat = new MatchingChat();
    newChat.sender = user; //요청자
    newChat.receiver = room.user2; //조건에 맞는 유저  matchingRoom.user2 = otherUser;
    newChat.message = chatMessageData.message;
    newChat.timestamp = new Date();
    newChat.matchingRoom = room;

    const savedChat = await this.matchingChatService.create(newChat);
    this.server.to(chatMessageData.roomId).emit("newMessage", savedChat);
  }
}
