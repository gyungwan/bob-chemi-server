// 빠른식사(퀵매칭) - 거리 반경..

import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

// 유저id - <성별,나이대,>
// 생성일
export enum EnumRating {
  BEST = 2,
  GOOD = 1,
  DISAPPOINTING = -1,
  POOR = -2,
}

export enum EnumValue {
  // "최고에요" = EnumRating.BEST,
  // "좋아요" = EnumRating.GOOD,
  // "아쉬워요" = EnumRating.DISAPPOINTING,
  // "별로에요" = EnumRating.POOR,
  BEST = "최고에요",
  GOOD = "좋아요",
  DISAPPOINTING = "아쉬워요",
  POOR = "별로에요",
}
@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  @ApiProperty({ description: " review id" })
  reviewId: string;

  @ApiProperty({ description: "리뷰" })
  @IsString()
  @Column({ type: "enum", enum: EnumValue, nullable: false })
  content: EnumValue;

  @Min(0)
  @Max(5)
  @ApiProperty({ description: "케미 지수" })
  @IsNumber()
  @Column({ type: "enum", enum: EnumRating, nullable: false })
  // @ManyToOne(() => User, (user) => user.chemiRating)
  // @JoinColumn()
  chemiRating: EnumRating;

  @ManyToOne(() => User, (user) => user.review, { onDelete: "CASCADE" }) //유저가 탈퇴할 때 리뷰도 같이 삭제
  // @JoinColumn({ name: "id" })
  user: User;

  @ApiProperty({ description: "작성일" })
  @CreateDateColumn()
  createdAt: Date;

  // 리뷰 삭제는 안되지만 탈퇴할 때는 가능
}
