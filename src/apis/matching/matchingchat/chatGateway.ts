import {
  ConsoleLogger,
  forwardRef,
  Inject,
  NotFoundException,
} from "@nestjs/common";
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
import { MatchingRoom } from "../quickmatchings/entities/matchingroom.entity";

// import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingChatService } from "./matchingchat.service";
import { User } from "src/apis/users/entities/user.entity";
import { Console } from "console";
import {
  AgeGroup,
  Gender,
  QuickMatching,
} from "../quickmatchings/entities/quickmatchings.entity";
import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
// localhost:3000/match로 요청을 보내면 이 gateway가 작동한다.
@WebSocketGateway({
  cors: {
    origin: [
      "http://localhost:3000",
      "https://localhost:3000",

      // "https://price-crush-client.vercel.app",
    ],
  },
  namespace: "/match",
})
@ApiTags("1:1 채팅API ")
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject(forwardRef(() => MatchingChatService))
    private readonly matchingChatService: MatchingChatService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>,

    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>,

    @Inject(forwardRef(() => QuickMatchingService))
    private readonly quickMatchingService: QuickMatchingService
  ) {}
  @WebSocketServer()
  server: Server;
  //post 부분에서 연결해서 클라이언트 소켓 아이디를 받아오고 그연결 된 상태에서 소켓아이디를 이용해서 매칭된 정보를 넘기고 하면 될거 같은데

  afterInit() {
    // this.server.adapter.on("delete-room", (room) => {
    //   const deletedRoom = createdRooms.find(
    //     (createdRoom) => createdRoom === room
    //   );
    //   if (!deletedRoom) return;
    // });
    // this.logger.log("웹소켓 서버 초기화✅");
  }

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

    //대화방에서 사용자 제거
    const rooms = this.server.sockets.adapter.rooms;
    for (const roomId of rooms.keys()) {
      if (client.rooms.has(roomId)) {
        client.leave(roomId);
        // 채팅방에서 사용자 제거를 처리하는 추가 코드,
        // 방의 참가자 목록을 업데이트하거나 방을 비활성으로 표시하는 것과 같은
        break;
      }
    }
  }

  //유저의 조건 정보를 받아와서 조건에 맞는 유저 매칭,매칭데이터 리턴
  @SubscribeMessage("requestMatching")
  async handleRequestMatching(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    {
      quickId,
    }: // targetGender,
    // targetAgeGroup,
    // location,
    {
      quickId: string;
      // targetGender: Gender;
      // targetAgeGroup: AgeGroup;
      // location: string;
    }
  ) {
    console.log(
      quickId,

      " ==================================="
    );
    const condition = await this.quickMatchingRepository.findOne({
      where: { id: quickId },
      relations: ["user"],
    });

    if (!condition) {
      client.emit("condition", {
        message: "quickMatching이 없습니다.",
      });
    }
    //console.log(condition);
    // 1. isMatched ==false 인 모든 퀵매칭 요청을 찾아옴
    const quickMatching =
      await this.quickMatchingService.findAllRequestMatching();
    //2. 조건 매칭

    const sortedMatching = quickMatching.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const succeedMatching: Partial<QuickMatching[]> = [];
    //const applicant: QuickMatching = quickMatching[i];
    for (let i = 0; i < quickMatching.length; i++) {
      //const applicant = quickMatching[i];

      const applicant: QuickMatching = quickMatching[i];
      const userAge = applicant.user.age;
      const userAgeGroup = this.getAgeGroup(userAge);

      // 자신의 정보와 일치하지 않는 다른 유저들을 선택
      // const otherUsers = quickMatching.filter(
      //   (match) => match.user.id !== applicant.user.id // 자신의 정보를 제외
      // );

      // 자신의 정보와 일치하지 않는 다른 유저들을 선택
      const otherUsers = quickMatching.filter(
        (match) =>
          match.user.id !== applicant.user.id && // 자신의 정보를 제외하고, 요청한 정보에 맞는 상대를 찾음
          match.user.gender === condition.targetGender &&
          this.getAgeGroup(match.user.age) === condition.targetAgeGroup &&
          match.location === condition.location
      );
      // console.log(
      //   otherUsers,
      //   "quickMatching=================================================",
      //   condition
      // );
      // 매칭 상대가 없다면 실패 메시지를 전송
      if (otherUsers.length === 0) {
        client.emit("matchingFailure", {
          message: "해당되는 유저가 없습니다.",
        });
        console.log("해당하는 유저가 없습니다.");
        return;
      }

      // 가장 먼저 매칭 요청을 한 사람을 선택

      const otherUser = otherUsers[0];
      console.log(otherUser, "---------------------------");
      applicant.isMatched = true;
      otherUser.isMatched = true;
      const matchingRoom = new MatchingRoom();
      matchingRoom.isMatched = true;
      matchingRoom.user1 = applicant.user;
      matchingRoom.user2 = otherUser.user;
      console.log(matchingRoom, "matchingRoom1111111111111111111111111111111");
      await this.matchingRoomRepository.save(matchingRoom);

      // console.log(
      //   applicant,
      //   "applicant",
      //   otherUser.isMatched,
      //   "otherUser.quickMatching.isMatched"
      // );
      await Promise.all([
        this.quickMatchingRepository.save(applicant),
        this.quickMatchingRepository.save(otherUsers[0]),
      ]);
      interface MatchedQuickMatching extends QuickMatching {
        MatchedUserName: string;
        MatchedUserId: string;
      }

      const matchedOtherUser: MatchedQuickMatching = {
        MatchedUserName: applicant.user.name,
        MatchedUserId: applicant.user.id,
        ...applicant,
      };

      succeedMatching.push(matchedOtherUser);
      console.log("매칭성공", matchingRoom, "------------------");
      client.emit("matchingSuccess", {
        message: "매칭 성공!",
        matchedUser: matchingRoom,
      });
      return succeedMatching;

      // for (let j = 0; j < otherUsers.length; j++) {
      //   const otherUser = otherUsers[j].user;
      //   const otherUserTargetAgeGroup = otherUsers[j].targetAgeGroup;
      //   const otherUserTargetGender = otherUsers[j].targetGender;
      //   const otherUserLocation = otherUsers[j].location;
      //   //const otherUserIsMatched = otherUsers[j].isMatched;
      //   const otherUserAge = otherUser.age;
      //   const otherUserAgeGroup = this.getAgeGroup(otherUserAge);

      //  // applicant.isMatched = true;
      //   // otherUser.quickMatching.isMatched = true;
      //   if (
      //     applicant.user.gender === otherUserTargetGender &&
      //     userAgeGroup === otherUserTargetAgeGroup &&
      //     applicant.targetGender === otherUser.gender &&
      //     applicant.targetAgeGroup === otherUserAgeGroup &&
      //     applicant.location == otherUserLocation
      //   ) {
      //     const matchingRoom = new MatchingRoom();
      //     matchingRoom.isMatched = true;
      //     matchingRoom.user1 = applicant.user;
      //     matchingRoom.user2 = otherUser;

      //     await this.matchingRoomRepository.save(matchingRoom);

      //     // await this.processMatchings(socketId, [matchingRoom]);
      //     applicant.isMatched = true;
      //     otherUsers[j].isMatched = true;
      //     await Promise.all([
      //       this.quickMatchingRepository.save(applicant),
      //       this.quickMatchingRepository.save(otherUsers),
      //     ]);

      //     interface MatchedQuickMatching extends QuickMatching {
      //       MatchedUserName: string;
      //       MatchedUserId: string;
      //       //IsMatched : boolean
      //     }

      //     const matchedOtherUser: MatchedQuickMatching = {
      //       MatchedUserName: applicant.user.name,
      //       MatchedUserId: applicant.user.id,
      //       //IsMatched: applicant.isMatched,
      //       ...applicant,
      //       user: otherUser,
      //     };

      //     succeedMatching.push(matchedOtherUser);
      //     client.emit("matchingSuccess", {
      //       message: "매칭 성공!",
      //       matchedUser: matchingRoom,
      //     });
      //     break;
      //   } else {
      //     client.emit("matchingFailure", {
      //       message: "해당되는 유저가 없습니다.",
      //     });
      //   }
      // }

      // if (succeedMatching.length === 0) {
      //   // 없을 경우 계속 반복하게 둬야 하는거 아닌가
      //   // 해당되는 유저가 없을 경우 예외 처리
      //   throw new NotFoundException("현재 매칭을 요청하는 유저가 없습니다");
      // }

      // if (succeedMatching.length > 0) {
      //   break;
      // }
    }
  }

  getAgeGroup(age: number): string {
    if (age >= 10 && age <= 19) {
      return "TEENAGER";
    } else if (age >= 20 && age <= 29) {
      return "TWENTIES";
    } else if (age >= 30 && age <= 39) {
      return "THIRTIES";
    } else if (age >= 40 && age <= 49) {
      return "FORTIES";
    } else if (age >= 50 && age <= 59) {
      return "FIFTIES";
    } else {
      return "기타";
    }
  }
  //'join room'과 'leave room' 이벤트는 유저가 채팅방에 접속하거나 떠날 때 서버에서 받는 이벤트입니다. 각각의 이벤트에 대한 핸들러에서는 유저를 해당 채팅방에 추가하거나 제거합니다.
  @SubscribeMessage("joinRoom")
  //   @ApiOperation({ summary: 'Send a chat message' })
  async onJoinRoom(client: Socket, chatRoomData: { chatRoomId: string }) {
    const chatRoomId = chatRoomData.chatRoomId;
    // console.log(chatRoomId, "11111111111----");
    const matchingRoom = await this.matchingRoomRepository.findOne({
      where: { id: chatRoomId },
      relations: ["user1", "user2"],
    });
    if (!matchingRoom) {
      // Handle error: Matching room not found
      return "Handle error: Matching room not found";
    }
    console.log(`Found matching room: `, matchingRoom);
    const user1Id = matchingRoom.user1.id;
    const user2Id = matchingRoom.user2.id;
    console.log(`User IDs: ${user1Id}, ${user2Id}`);
    client.join(chatRoomId);
    client.emit("joinedRoom", {
      message: "조인 성공!",
      chatRoomId,
      user1Id,
      user2Id,
    });

    // Inform the users that they are now connected
    this.server.to(user1Id).emit("usersConnected");
    this.server.to(user2Id).emit("usersConnected");
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

  // This event handles sending a message to a specific room
  @SubscribeMessage("chat")
  async handleChat(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    messageData: {
      sender: string;
      receiver: string;
      message: string;
      roomId: string;
    }
  ) {
    const { sender, receiver, message, roomId } = messageData;

    const senderUser = await this.userRepository.findOne({
      where: { id: sender },
    });
    const receiverUser = await this.userRepository.findOne({
      where: { id: receiver },
    });

    if (!senderUser || !receiverUser) {
      console.log("One or both users were not found!");
      return;
    }

    const chatMessage = new MatchingChat();
    chatMessage.sender = senderUser;
    chatMessage.receiver = receiverUser;
    chatMessage.message = message;
    chatMessage.roomId = roomId;
    chatMessage.timestamp = new Date();
    await this.matchingChatService.create(chatMessage);

    const receivedChat: ReceivedChat = {
      message: chatMessage.message,
      sender: chatMessage.sender.id,
      time: chatMessage.timestamp.toISOString(), // Add the current timestamp or use a library to format the timestamp
    };

    // Emit the message to the room
    this.server.to(roomId).emit("chated", receivedChat);
  }

  @SubscribeMessage("getChatHistory")
  async handleGetChatHistory(client: Socket, chatRoomId: string) {
    // Retrieve the chat history for the room from the database
    const chatHistory = await this.matchingChatService.getChatHistory(
      chatRoomId
    );

    // Emit the chat history to the client
    client.emit("chatHistory", chatHistory);
  }

  @SubscribeMessage("leaveRoom")
  async onLeaveRoom(client: Socket, chatRoomId: string) {
    client.leave(chatRoomId);
    client.emit("leaveRoom", chatRoomId);

    // 채팅방에서 나갔으므로 해당 채팅방의 메시지를 모두 삭제한다.
    await this.matchingChatService.deleteChatRoomMessages(chatRoomId);
  }
}
export interface ReceivedChat {
  message: string;
  sender: string;
  time: string;
}
