import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { Group } from "./entites/groups.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { UsersService } from "src/apis/users/users.service";
import { Member } from "./entites/members.entity";
import { ConfigModule } from "@nestjs/config";
import { FileUploadModule } from "src/apis/file-upload/file-upload.module";
import { FileUploadService } from "src/apis/file-upload/file-upload.service";
import { ChatRoom } from "../groupChat/entities/chatRooms.entity";
import { GroupChatService } from "../groupChat/groupChats.service";
import { ChatRoomUser } from "../groupChat/entities/chatRoomUsers.entity";
import { Chat } from "../groupChat/entities/chats.entity";
import { GroupChatsGateway } from "../groupChat/groupChats.gateway";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      Member,
      User,
      ChatRoom,
      ChatRoomUser,
      Chat,
    ]),
    ConfigModule,
    FileUploadModule,
  ],
  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [
    GroupsService,
    Repository,
    UsersService,
    FileUploadService,
    GroupChatsGateway,
    GroupChatService,
  ],
})
export class GroupsModule {}
