import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { Group } from "./entites/groups.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { UsersService } from "src/apis/users/users.service";
import { Member } from "./entites/members.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Group, Member, User])],
  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [GroupsService, Repository, UsersService],
})
export class GroupsModule {}
