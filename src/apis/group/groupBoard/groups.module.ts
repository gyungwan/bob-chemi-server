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
import { FileUploadModule } from "src/apis/file-upload/file-upload.module";
import { FileUploadService } from "src/apis/file-upload/file-upload.service";
//import { multerOptionsFactory } from "src/common/utils/multer.options";
@Module({
  imports: [
    TypeOrmModule.forFeature([Group, Member, User]),
    ConfigModule,
    FileUploadModule,
  ],

  exports: [GroupsService],
  controllers: [GroupsController],
  providers: [GroupsService, Repository, UsersService, FileUploadService],
})
export class GroupsModule {}
