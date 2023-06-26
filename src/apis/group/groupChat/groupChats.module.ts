import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatRoom } from "./entities/chatRooms.entity";
import { Chat } from "./entities/chats.entity";
import { GroupChatsGateway } from "./groupChats.gateway";
import { GroupChatService } from "./groupChats.service";
import { Repository } from "typeorm";
import { GroupChatsController } from "./groupChats.controller";
import { User } from "src/apis/users/entities/user.entity";
import { UsersService } from "src/apis/users/users.service";
import { ChatRoomUser } from "./entities/chatRoomUsers.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Chat, ChatRoom, User, ChatRoomUser])],
  controllers: [GroupChatsController],
  providers: [GroupChatService, GroupChatsGateway, UsersService, Repository],
  exports: [GroupChatService],
})
export class GroupChatsModule {}
