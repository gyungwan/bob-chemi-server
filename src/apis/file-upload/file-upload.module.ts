import { Module } from "@nestjs/common";
import { FileUploadService } from "./file-upload.service";
import { FileUploadController } from "./file-upload.controller";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { multerOptionsFactory } from "src/common/utils/multer.options";

@Module({
  imports: [
    ConfigModule.forRoot(),
    // MulterModule.registerAsync({
    //   imports: [ConfigModule],
    //   useFactory: multerOptionsFactory,
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService, ConfigService],
})
export class FileUploadModule {}
