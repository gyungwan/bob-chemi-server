import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "src/apis/users/users.service";
import { User } from "../../users/entities/user.entity";
import { MatchingRoom } from "../quickmatchings/entities/matchingroom.entity";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { QuickMatchingModule } from "../quickmatchings/quickmatchings.module";
import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
// import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { ChatGateway } from "./chatGateway";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingChatController } from "./matchingchat.controller";
//import { MatchingChatGateway } from "./matchingchat.gateway";
import { MatchingChatService } from "./matchingchat.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchingChat, User, MatchingRoom, QuickMatching]),
    QuickMatchingModule,
  ],

  exports: [MatchingChatService],
  controllers: [MatchingChatController],
  providers: [
    MatchingChatService,
    ChatGateway,
    QuickMatchingService,
    UsersService,
  ],
})
export class MatchingChatModule {}
