// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayInit,
// } from "@nestjs/websockets";
// import { Server, Socket } from "socket.io";

// @WebSocketGateway()
// export class MatchingChatGateway implements OnGatewayInit {
//   @WebSocketServer()
//   server: Server;

//   afterInit(server: Server) {
//     // Gateway 초기화 후 실행할 로직을 작성합니다.
//   }

//   @SubscribeMessage("chatMessage")
//   handleMessage(client: Socket, message: string) {
//     // 클라이언트로부터 수신된 메시지를 처리합니다.
//     // 필요한 로직을 작성합니다.
//     // 예: 다른 클라이언트들에게 메시지를 방송합니다.
//     this.server.emit("chatMessage", message);
//   }
// }
