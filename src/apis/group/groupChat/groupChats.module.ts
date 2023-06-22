import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { Chat } from "./entities/chats.entity";
import { GroupChatsGateway } from "./groupChats.gateway";
import { GroupChatService } from "./groupChats.service";
import { Repository } from "typeorm";
import { GroupChatsController } from "./groupChats.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom])],
  controllers: [GroupChatsController],
  providers: [GroupChatService, GroupChatsGateway, Repository],
  exports: [GroupChatService],
})
export class GroupChatsModule {}
