import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../users/entities/user.entity";
import { Repository } from "typeorm";
import { Group } from "./entites/groups.entity";
import { GroupsController } from "./groups.controller";
import { GroupsService } from "./groups.service";
import { UsersService } from "src/apis/users/users.service";
import { Member } from "./entites/members.entity";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { multerOptionsFactory } from "src/common/utils/multer.options";
@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Member, User]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],

  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [GroupsService, Repository, UsersService],
})
export class GroupsModule {}
