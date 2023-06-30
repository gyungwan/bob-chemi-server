import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/apis/users/entities/user.entity";
import { MatchingChat } from "../matchingchat/entities/matchingchat.entity";

import { MatchingChatModule } from "../matchingchat/matchingchat.module";
import { MatchingChatService } from "../matchingchat/matchingchat.service";
import { MatchingRoom } from "../matchingroom/entities/matchingroom.entity";
import { ChatGateway } from "./\bchatGateway";

@Module({
  imports: [
    TypeOrmModule.forFeature([MatchingChat, User, MatchingRoom]),
    MatchingChatModule,
  ],
  providers: [ChatGateway, MatchingChatService],
  exports: [ChatGateway],
})
export class ChatGatewayModule {}
