import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./apis/users/users.module";
import { AuthModule } from "./apis/auth/auth.module";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    CacheModule.register({
      store: redisStore,
      // host: "localhost", // Redis 호스트 주소
      // port: 6379, // Redis 포트 번호
      url: "redis://my-redis:6379",
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
