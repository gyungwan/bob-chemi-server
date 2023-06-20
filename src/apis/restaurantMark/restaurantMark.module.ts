import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantMark } from "./entities/restaurantMark.entity";
import { RestaurantMarkController } from "./restaurantMark.controller";
import { RestaurantMarkService } from "./restaurantMark.service";

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantMark])],
  controllers: [RestaurantMarkController],
  exports: [RestaurantMarkService],
  providers: [RestaurantMarkService],
})
export class RestaurantMarkModule {}
