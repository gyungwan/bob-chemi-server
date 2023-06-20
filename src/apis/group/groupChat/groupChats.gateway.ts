import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { groupChatAdapter } from "./groupChats.adapter";
import { GroupChatService } from "./groupChats.service";

@WebSocketGateway({
  namespace: "groupChat",
  cors: { origin: "*" },
  adapter: new groupChatAdapter(),
})
export class GroupChatsGateway
  implements
    OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayInit
{
  constructor(private groupChatService: GroupChatService) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger("GroupChatGateway");

  afterInit() {
    this.logger.log("서버 초기화");
  }

  onModuleInit() {
    this.server.on("connection", (socket) => {
      console.log(socket.id);
      console.log("Connected");
    });
  }

  handleConnection(client: any, ...args: any[]) {
    const nickname = client.handshake.query["nickname"];
    this.logger.log(`${client.id} (${nickname}) 님이 입장하셨습니다.`);
  }

  handleDisconnect(client: any, ...args: any[]) {
    const nickname = client.handshake.query["nickname"];
    this.logger.log(`${client.id} (${nickname}) 님이 퇴장하셨습니다.`);
  }
}
