import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const config: TypeOrmModuleOptions = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "your_username",
  password: "your_password",
  database: "your_database",
  synchronize: true,
  logging: true,
  entities: ["./src/entities/*.entity{.ts,.js}"],
  //   migrations: [__dirname + '/src/migrations/*{.ts,.js}'],
  //   subscribers: [__dirname + '/src/subscribers/*{.ts,.js}'],
  //   cli: {
  //     entitiesDir: 'src/entities',
  //     migrationsDir: 'src/migrations',
  //     subscribersDir: 'src/subscribers',
  //   },
};
