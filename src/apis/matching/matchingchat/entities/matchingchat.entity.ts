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
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { MatchingRoom } from "../../matchingroom/entities/matchingroom.entity";
@Entity()
export class MatchingChat {
  @PrimaryGeneratedColumn("uuid")
  @IsString()
  @ApiProperty({ description: "id" })
  id: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  @JoinColumn({ name: "senderId" }) //외부키 설정
  sender: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  @JoinColumn({ name: "receiverId" })
  receiver: User;

  @Column()
  message: string; // 개별 메세지

  @Column()
  timestamp: Date; //메세지가 전송된 시간

  @Column({ nullable: false }) // 1:1 채팅이기 때문에 필수
  roomId: string; //채팅이 속한 방 또는 대화의 식별자

  @ApiProperty({ description: "채팅 저장" })
  @IsString()
  @Column({ nullable: false }) // 시간순으로 정렬하여 저장 및 조회 가능
  log: string; //여러 개의 메시지를 포함하는 전체 채팅의 기록

  @OneToOne(() => MatchingRoom, (matchingRoom) => matchingRoom.matchingChat)
  matchingRoom: MatchingRoom;
}
// @Min(0)
// @Max(5)
// @ApiProperty({ description: "케미 지수" })
// @IsNumber()
// @Column({ nullable: false })
// chemiRating: number;

// @ManyToOne(() => User, { onDelete: "CASCADE" })
// @JoinColumn({ name: "id" })
// user: User;

// @ApiProperty({ description: "작성일" })
// @CreateDateColumn()
// createdAt: Date;
