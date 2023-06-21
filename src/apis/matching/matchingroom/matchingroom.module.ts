import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { MatchingRoom } from "./entities/matchingroom.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MatchingRoom, QuickMatching])],

  // exports: [QuickMatchingService],
  // controllers: [QuickMatchingController],
  // providers: [QuickMatchingService, UsersService],
})
export class MatchingRoomModule {}
