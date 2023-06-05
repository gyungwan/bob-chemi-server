import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { Group } from "./entites/groups.entity";
import { Member } from "./entites/members.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";

@Module({
  imports: [TypeOrmModule.forFeature([Group, Member, User])],
  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [GroupsService, Repository],
})
export class GroupsModule {}
