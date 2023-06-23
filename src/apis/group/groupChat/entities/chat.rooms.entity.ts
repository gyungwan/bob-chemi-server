import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./chats.entity";

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "채팅방 고유 ID" })
  chatRoomId: string;

  @Column()
  @ApiProperty({ description: "채팅방 이름" })
  roomName: string;

  @ManyToOne(() => User, (user) => user.chatRooms)
  @ApiProperty({ description: "채팅방 이용자" })
  user: User;

  @OneToMany(() => Chat, (chat) => chat.chatRoom, { cascade: true })
  @ApiProperty({ type: () => Chat, isArray: true, description: "채팅 목록" })
  chats: Chat[];
}
