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
import { MatchingRoom } from "./matchingroom.entity";

//성별, 나이대

export enum Gender {
  Male = "Male",
  Female = "Female",
}
//export type GenderString = "Male" | "Female";
export enum AgeGroup {
  TEENAGER = "TEENAGER",
  TWENTIES = "TWENTIES",
  THIRTIES = "THIRTIES",
  FORTIES = "FORTIES",
  FIFTIES = "FIFTIES",
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
    nullable: true,
  })
  @ApiProperty({ description: "원하는 상대의 성별" })
  targetGender: Gender;

  @Column({ type: "enum", enum: AgeGroup, nullable: true })
  @ApiProperty({ description: "원하는 상대의 연령대" })
  targetAgeGroup: AgeGroup;

  @Column()
  @ApiProperty({ description: "사용자 위치" })
  location: string;

  @Column({ type: "boolean", default: false })
  @ApiProperty({ description: "매칭 여부" })
  isMatched: boolean;

  @ApiProperty({ description: "매칭 성사일" })
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.quickMatching)
  @JoinColumn({ name: "userId" })
  user: User;

  // @OneToOne(() => User, (targetUser) => targetUser.quickMatching)
  // @JoinColumn({ name: "targetUserId" })
  // //matchedUser: User;
  // targetUser: User;

  @OneToOne(() => MatchingRoom, (matchingRoom) => matchingRoom.quickMatching)
  @JoinColumn()
  matchingRoom: MatchingRoom;

  @ApiProperty({ description: "매칭 취소일" })
  @DeleteDateColumn()
  deletedAt: Date;
}
