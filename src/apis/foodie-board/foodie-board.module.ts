import { Module } from "@nestjs/common";
import { FoodieBoardService } from "./foodie-board.service";
import { FoodieBoardController } from "./foodie-board.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodieBoard } from "./entities/foodie-board.entity";

@Module({
  imports: [TypeOrmModule.forFeature([FoodieBoard])],
  controllers: [FoodieBoardController],
  providers: [FoodieBoardService],
})
export class FoodieBoardModule {}
