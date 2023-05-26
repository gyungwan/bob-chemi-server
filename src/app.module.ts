import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { BoardRepository } from "./apis/group/boards/board.repository";
import { BoardsController } from "./apis/group/boards/boards.controller";
import { BoardService } from "./apis/group/boards/boards.service";
import { Review } from "./apis/reviews/entities/reviews.entity";
import { ReviewsController } from "./apis/reviews/reviews.controller";
import { ReviewsModule } from "./apis/reviews/reviews.module";

@Module({
  imports: [
    ReviewsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    // SwaggerModule.forRoot({
    //   swaggerCustomOptions: {
    //     swaggerOptions: {
    //       // Swagger UI 옵션
    //     },
    //   },
    //   // 다양한 설정 옵션
    // }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + "/apis/**/*.entity.*"],
      synchronize: true,
      logging: true,
    }),

    TypeOrmModule.forFeature([BoardRepository]),
  ],
  controllers: [AppController, BoardsController],
  providers: [AppService, BoardService],
})
export class AppModule {}
