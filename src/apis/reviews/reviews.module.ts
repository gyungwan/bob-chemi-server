import { Review } from "./entities/reviews.entity";

import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

@Module({
  imports: [TypeOrmModule.forFeature([Review, User])], // review, user

  exports: [ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService, UsersService],
})
export class ReviewsModule {}

// @Module({
//     imports: [
//       ScheduleModule.forRoot(),
//       TypeOrmModule.forFeature([Auction, Product, ProductImage]),
//       MulterModule.registerAsync({
//         imports: [ConfigModule],
//         useFactory: multerOptionsFactory,
//         inject: [ConfigService],
//       }),
//     ],
//     exports: [ProductsService],
//     controllers: [ProductsController],
//     providers: [ProductsService, AuctionService, Repository],
//   })
//   export class ProductsModule {}
