import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { Chat } from "./entities/chats.entity";
import { ChatRoomsController } from "./groupChats.controller";
import { ChatRoomsService } from "./groupChats.service";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom])],
  exports: [ChatRoomsService],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsService],
})
export class GroupChatsModule {}
