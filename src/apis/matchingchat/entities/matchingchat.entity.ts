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
@Entity()
export class MatchingChat {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  @ApiProperty({ description: "id" })
  id: string;

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

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "id" })
  user: User;

  @ApiProperty({ description: "작성일" })
  @CreateDateColumn()
  createdAt: Date;
}
