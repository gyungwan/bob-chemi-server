import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingChatGateway } from "./matchingchat.gateway";
import { MatchingChatService } from "./matchingchat.service";

@Module({
  imports: [TypeOrmModule.forFeature([MatchingChat, User])],
  providers: [MatchingChatGateway, MatchingChatService],
})
export class MatchingChatModule {}
