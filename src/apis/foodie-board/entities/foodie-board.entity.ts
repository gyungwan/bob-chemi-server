import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { FoodieImage } from "./foodieBoard-image.entity";

@Entity()
export class FoodieBoard {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "맛집 게시물ID" })
  id: string;

  @Column()
  @ApiProperty({ description: "맛집 게시물 제목" })
  title: string;

  @Column()
  @ApiProperty({ description: "맛집 게시물 내용" })
  content: string;

  @CreateDateColumn()
  @ApiProperty({ description: "맛집 게시물 생성일" })
  creadeAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "맛집 게시물 수정일" })
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: "맛집 게시물 삭제" })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.FoodieBoard)
  @ApiProperty({ type: () => User })
  user: User;

  @OneToMany(() => FoodieImage, (foodieImage) => foodieImage.foodieBoard, {
    cascade: true,
  })
  images: FoodieImage[];
}
