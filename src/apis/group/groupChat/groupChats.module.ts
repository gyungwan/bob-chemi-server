import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { Chat } from "./entities/chats.entity";
import { groupChatAdapter } from "./groupChats.adapter";
import { GroupChatController } from "./groupChats.controller";
import { GroupChatService } from "./groupChats.service";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom])],
  exports: [GroupChatService],
  controllers: [GroupChatController],
  providers: [GroupChatService, groupChatAdapter],
})
export class GroupChatsModule {}
