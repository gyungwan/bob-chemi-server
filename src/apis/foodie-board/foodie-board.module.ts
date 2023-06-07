import { Module } from "@nestjs/common";
import { FoodieBoardService } from "./foodie-board.service";
import { FoodieBoardController } from "./foodie-board.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodieBoard } from "./entities/foodie-board.entity";
import { FoodieImage } from "./entities/foodieBoard-image.entity";
import { FileUploadService } from "../file-upload/file-upload.service";

@Module({
  imports: [TypeOrmModule.forFeature([FoodieBoard, FoodieImage])],
  controllers: [FoodieBoardController],
  providers: [FoodieBoardService, FileUploadService],
})
export class FoodieBoardModule {}
