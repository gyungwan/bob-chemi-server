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
import { Review } from "./apis/reviews/entities/reviews.entity";
import { ReviewsController } from "./apis/reviews/reviews.controller";
import { ReviewsModule } from "./apis/reviews/reviews.module";
import { jwtAccessStrategy } from "./common/auth/jwt-access.strategy";
import { jwtRefreshStrategy } from "./common/auth/jwt-refresh.strategy";
import { JwtModule } from "@nestjs/jwt";
import { MatchingChat } from "./apis/matchingchat/entities/matchingchat.entity";
import { MatchingChatModule } from "./apis/matchingchat/matchingchat.module";
import { FoodieBoardModule } from "./apis/foodie-board/foodie-board.module";
<<<<<<< HEAD
import { FileUploadModule } from './apis/file-upload/file-upload.module';
=======
import { GroupsController } from "./apis/group/groupBoard/groups.controller";
import { GroupsService } from "./apis/group/groupBoard/groups.service";
import { GroupChatsModule } from "./apis/group/groupChat/groupChats.module";
import { GroupsModule } from "./apis/group/groupBoard/groups.module";
import { Repository } from "typeorm";
>>>>>>> main

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
    MatchingChatModule,
    FoodieBoardModule,
    GroupsModule,
    GroupChatsModule,
    CacheModule.register({
      store: redisStore,
      // host: "localhost", // Redis 호스트 주소
      // port: 6379, // Redis 포트 번호
      url: "redis://my-redis:6379",
      // url: "redis://localhost:6379",
      isGlobal: true,
    }),
<<<<<<< HEAD

    TypeOrmModule.forFeature([BoardRepository]),

    FoodieBoardModule,

    FileUploadModule,
=======
>>>>>>> main
  ],
  controllers: [AppController],
  providers: [AppService, jwtAccessStrategy, jwtRefreshStrategy],
})
export class AppModule {}
