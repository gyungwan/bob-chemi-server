import { Logger } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MatchingChatService } from "./matchingchat.service";
// 채팅 기록 저장
@WebSocketGateway(8080, {
  namespace: "matchingchat",
  cors: { origin: "*" }, // 서버 실행 시 서버주소:포트번호/네임스페이스
})
@ApiTags("MatchingChat")
export class MatchingChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly matchingChatService: MatchingChatService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("MatchingChatGateway"); //로그를 기록하고 디버깅, 저장x

  //   @SubscribeMessage("matchingchat") // 클라이언트에서 보낸 메세지를 수신하는 핸들러
  //   handleEvent(@MessageBody() data: string): string {
  //     return data;
  //   }

  afterInit(server: Server) {
    // Gateway 초기화 후 실행할 로직을 작성합니다.
    this.logger.log("웹소켓 서버 초기화");
  }

  @SubscribeMessage("ClientToServer") //matchingchat, 프엔이랑 맞춰줌
  handleMessage(client: Socket, @MessageBody() data: string) {
    this.server.emit("ServerToClient", data); //matchingchat
    this.matchingChatService.addChatLog(data); // 채팅 기록 저장
  } //클라이언트에서 ClientToServer라는 이름으로 메세지를 보내면 서버에선 메세지의 body에서 데이터를 읽어와 그대로 ServerToClient라는 이름으로 보낸다.

  handleConnection(client: Socket) {
    // 유저가 접속하면 동작
    //this.logger.log("${client.id} 님이 입장하셨습니다.");
    const nickname = client.handshake.query["nickname"];
    this.logger.log(`${client.id} (${nickname}) 님이 입장하셨습니다.`);
  }

  handleDisconnect(client: Socket) {
    //웹소켓 연결이 종료되었을 때 실행
    // 유저 접속이 끊어지면 실행
    const nickname = client.handshake.query["nickname"];
    this.logger.log("${client.id} (${nickname}) 님이 퇴장하셨습니다.");
    //ChatGateway.logger.debug(`${client.id} is disconnected...`);
  }
}

//   @SubscribeMessage("chatMessage")
//   handleMessage(client: Socket, message: string) {
//     // 클라이언트로부터 수신된 메시지를 처리합니다.
//     // 필요한 로직을 작성합니다.
//     // 예: 다른 클라이언트들에게 메시지를 방송합니다.
//     this.server.emit("chatMessage", message);
//   }
// }
