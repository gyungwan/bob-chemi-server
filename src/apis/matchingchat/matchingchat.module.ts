import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { MatchingChat } from "./entities/matchingchat.entity";

@Module({
  imports: [TypeOrmModule.forFeature([MatchingChat])], // review, user

  //   exports: [ReviewsService],
  //   controllers: [ReviewsController],
  //   providers: [ReviewsService],
})
export class ReviewsModule {}
