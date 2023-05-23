import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
