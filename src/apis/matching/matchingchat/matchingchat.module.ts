import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { MatchingRoom } from "../matchingroom/entities/matchingroom.entity";
import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingChatController } from "./matchingchat.controller";
import { MatchingChatGateway } from "./matchingchat.gateway";
import { MatchingChatService } from "./matchingchat.service";

@Module({
  imports: [TypeOrmModule.forFeature([MatchingChat, User, MatchingRoom])],

  exports: [MatchingChatService],
  controllers: [MatchingChatController],
  providers: [MatchingChatGateway, MatchingChatService],
})
export class MatchingChatModule {}
