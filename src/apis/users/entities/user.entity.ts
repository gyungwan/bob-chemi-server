import { ApiProperty } from "@nestjs/swagger";
import { MatchingChat } from "src/apis/matching/matchingchat/entities/matchingchat.entity";
import { FoodieBoard } from "src/apis/foodie-board/entities/foodie-board.entity";
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  JoinTable,
  PrimaryGeneratedColumn,
  ManyToMany,
} from "typeorm";
import { Review } from "src/apis/reviews/entities/reviews.entity";
import { QuickMatching } from "src/apis/matching/quickmatchings/entities/quickmatchings.entity";
import { RestaurantMark } from "src/apis/restaurantMark/entities/restaurantMark.entity";
import { Group } from "src/apis/group/groupBoard/entites/groups.entity";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "유저 고유 아이디" })
  id: string;

  @Column()
  @ApiProperty({ description: "유저 이메일" })
  email: string;

  @Column()
  @ApiProperty({ description: "유저 비밀번호" })
  password: string;

  @Column()
  @ApiProperty({ description: "유저 전화번호" })
  phone: string;

  @Column()
  @ApiProperty({ description: "유저 닉네임" })
  nickname: string;

  @Column()
  @ApiProperty({ description: "유저 이름" })
  name: string;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: false,
  })
  @ApiProperty({ description: "유저 성별" })
  gender: Gender;

  @Column()
  @ApiProperty({ description: "유저 나이" })
  age: number;

  @Column({ default: 45 })
  @ApiProperty({ description: "유저 케미지수" })
  chemiRating: number;
  //   @Column()
  //   @ApiProperty({ description: "서비스 이용 약관 동의 여부" })
  //   agreement_use: boolean;

  //   @Column()
  //   @ApiProperty({ description: "마케팅 수신 동의 여부" })
  //   agreement_mkt: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: "유저 생성일" })
  createdAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: "유저 수정일" })
  updatedAt: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: "유저 탈퇴" })
  deletedAt: Date;

  @OneToMany(() => MatchingChat, (matchingChat) => matchingChat.sender)
  sentMessages: MatchingChat[];

  @OneToMany(() => MatchingChat, (matchingChat) => matchingChat.receiver)
  receivedMessages: MatchingChat[];

  // 다대일 관계 설정
  @OneToMany(() => Review, (review) => review.user)
  review: Review[];

  @OneToMany(() => FoodieBoard, (FoodieBoard) => FoodieBoard.user)
  @ApiProperty({ type: () => FoodieBoard })
  FoodieBoard: FoodieBoard[];

  @OneToOne(() => QuickMatching, (quickMatching) => quickMatching.user)
  quickMatching: QuickMatching;

  @OneToMany(() => RestaurantMark, (restaurantMark) => restaurantMark.user)
  restaurantMarks: RestaurantMark[];

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];
}
