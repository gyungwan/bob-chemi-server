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

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  @ApiProperty({ description: "id" })
  reviewId: string;

  @ApiProperty({ description: "리뷰" })
  @IsString()
  @Column({ length: 50, nullable: true })
  content: string;

  @Min(0)
  @Max(5)
  @ApiProperty({ description: "케미 지수" })
  @IsNumber()
  @Column({ nullable: false })
  chemiRating: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" }) //유저가 탈퇴할 때 리뷰도 같이 삭제
  @JoinColumn({ name: "id" })
  user: User;

  @ApiProperty({ description: "작성일" })
  @CreateDateColumn()
  createdAt: Date;

  // 리뷰 삭제는 안되지만 탈퇴할 때는 가능
}
