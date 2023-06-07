import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { Server } from "ws";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";

@WebSocketGateway(8080)
export class GroupChatGateway {
  @WebSocketServer() //websocket에서 가져오는 서버를 socket.io의 서버 타입 적용
  server: Server;

  @SubscribeMessage("message") //message를 받으면 onEvent함수를 작동하여 return
  handleMessage(@MessageBody() message: string): void {
    this.server.emit("message", message);
  }

  // @SubscribeMessage("message") //message를 받으면 onEvent함수를 작동하여 return
  // onEvent(client: any, data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: "events", data: item }))
  //   );
  // }
}
