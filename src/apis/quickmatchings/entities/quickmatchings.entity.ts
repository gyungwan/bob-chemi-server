// 빠른식사(퀵매칭) - 거리 반경..

import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

//성별, 나이대

export enum Gender {
  Male = "Male",
  Female = "Female",
}

// export const AgeGroup = [
//   { name: "10대", minAge: 10, maxAge: 19 },
//   { name: "20대", minAge: 20, maxAge: 29 },
//   { name: "30대", minAge: 30, maxAge: 39 },
//   { name: "40대", minAge: 40, maxAge: 49 },
//   { name: "50대", minAge: 50, maxAge: 59 },
// ];

export enum AgeGroup {
  TEENAGER = "10대",
  TWENTIES = "20대",
  THIRTIES = "30대",
  FORTIES = "40대",
  FIFTIES = "50대",
}
// 1대1 매칭은 일대일관계
@Entity()
export class QuickMatching {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "quickMatching id" })
  id: string;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: false,
  })
  @ApiProperty({ description: "유저 성별" })
  gender: Gender;

  @Column({ type: "enum", enum: AgeGroup, nullable: false })
  @ApiProperty({ description: "유저 연령대" })
  ageGroup: AgeGroup;

  @Column({ type: "boolean", default: false })
  @ApiProperty({ description: "매칭 여부" })
  isMatched: boolean;

  @ApiProperty({ description: "매칭 성사일" })
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.quickMatching)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToOne(() => User, (matchedUser) => matchedUser.quickMatching)
  @JoinColumn({ name: "matchedUserId" })
  matchedUser: User;

  @ApiProperty({ description: "매칭 취소일" })
  @DeleteDateColumn()
  deletedAt: Date;
}
