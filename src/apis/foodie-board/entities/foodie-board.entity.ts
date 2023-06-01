import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @Column({ nullable: true })
  @ApiProperty({ description: "맛집 게시물 생성일" })
  creadeAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: "맛집 게시물 수정일" })
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: "맛집 게시물 삭제" })
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.FoodieBoard)
  @ApiProperty({ type: () => User })
  user: User[];

  //이미지 업로드하는 부분 넣기
}
