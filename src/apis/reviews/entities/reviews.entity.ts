// 빠른식사(퀵매칭) - 거리 반경..

import { ApiProperty } from "@nestjs/swagger";
//import { Min } from "class-validator";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

// 유저id - <성별,나이대,>
// 생성일
// 삭제일

@Entity()
export class Review {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty()
  reviewId: string;

  @ApiProperty()
  @Column()
  content: string;

  //@Min(0)
  @ApiProperty()
  @Column()
  chemiRating: number;

  //@ManyToOne(() => User, {onDelete: 'CASCADE'}) //유저가 탈퇴할 때 리뷰도 같이 삭제

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  //   @ApiProperty()
  //   @DeleteDateColumn() //softDelete
  //   deletedAt: Date; => 기록욤

  // 영구적으로 데이터 삭제
  //    async deleteForever() {
  //     await this.remove();
  //   }
  // 리뷰 삭제는 안되지만 탈퇴할 때는 가능
}
