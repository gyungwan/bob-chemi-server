// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { User } from "src/apis/users/entities/user.entity";
// import { UsersService } from "src/apis/users/users.service";
// import { ChatGateway } from "../matchingchat/chatGateway";
// import { ChatGatewayModule } from "../ChatGateway/chatGateway.module";
// import { MatchingChat } from "../matchingchat/entities/matchingchat.entity";
// import { MatchingChatService } from "../matchingchat/matchingchat.service";
// import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
// import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
// import { MatchingRoom } from "../quickmatchings/entities/matchingroom.entity";
// import { MatchingRoomController } from "./matchingroom.controller";
// import { MatchingRoomService } from "./matchingroom.service";

// @Module({
//   imports: [
//     TypeOrmModule.forFeature([MatchingRoom, User, QuickMatching, MatchingChat]),
//     ChatGatewayModule,
//   ],

//   exports: [MatchingRoomService],
//   controllers: [MatchingRoomController],
//   providers: [
//     MatchingRoomService,
//     UsersService,
//     QuickMatchingService,
//     MatchingChatService,
//   ],
// })
// export class MatchingRoomModule {}
