import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./apis/users/users.module";
import { AuthModule } from "./apis/auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ReviewsModule } from "./apis/reviews/reviews.module";
import { jwtAccessStrategy } from "./common/auth/jwt-access.strategy";
import { jwtRefreshStrategy } from "./common/auth/jwt-refresh.strategy";
import { JwtModule } from "@nestjs/jwt";
import { MatchingChat } from "./apis/matching/matchingchat/entities/matchingchat.entity";
import { MatchingChatModule } from "./apis/matching/matchingchat/matchingchat.module";
import { FoodieBoardModule } from "./apis/foodie-board/foodie-board.module";
import { FileUploadModule } from "./apis/file-upload/file-upload.module";
import { GroupsModule } from "./apis/group/groupBoard/groups.module";
import { GroupChatsModule } from "./apis/group/groupChat/groupChats.module";
import { QuickMatchingModule } from "./apis/matching/quickmatchings/quickmatchings.module";
import { RestaurantMarkModule } from "./apis/restaurantMark/restaurantMark.module";
import { MatchingRoomModule } from "./apis/matching/matchingroom/matchingroom.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    //ConfigModule.forRoot({ isGlobal: true }),
    // SwaggerModule.forRoot({
    //   swaggerCustomOptions: {
    //     swaggerOptions: {
    //       // Swagger UI 옵션
    //     },
    //   },
    //   // 다양한 설정 옵션
    // }),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_KEY, // access 토큰의 secret 값
      signOptions: { expiresIn: "1h" },
    }),
    JwtModule.register({
      secret: process.env.JWT_REFRESH_KEY, // refresh 토큰의 secret 값
      signOptions: { expiresIn: "2w" },
    }),
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
    UsersModule,
    AuthModule,
    ReviewsModule,
    RestaurantMarkModule,
    MatchingChatModule,
    FoodieBoardModule,
    GroupsModule,
    GroupChatsModule,
    FileUploadModule,
    QuickMatchingModule,
    MatchingRoomModule,
    CacheModule.register({
      store: redisStore,
      // host: "localhost", // Redis 호스트 주소
      // port: 6379, // Redis 포트 번호
      url: "redis://my-redis:6379",
      // url: "redis://localhost:6379",
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, jwtAccessStrategy, jwtRefreshStrategy],
})
export class AppModule {}
