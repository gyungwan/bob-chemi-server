import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";

export class groupChatAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    //서버 인스턴스 생성
    // port : Socket.io가 수신 대기할 포트, Option : socket.io서버의 옵션
    const server = super.createIOServer(port, options);
    return server;
  }
}
