import { ApiProperty } from "@nestjs/swagger";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Chat } from "./chats.entity";
import { ChatRoomUser } from "./chatRoomUsers.entity";

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "채팅방 고유 ID" })
  chatRoomId: string;

  @Column()
  @ApiProperty({ description: "채팅방 이름", example: "채팅방" })
  roomName: string;

  @OneToMany(() => Chat, (chat) => chat.chatRoom, { cascade: true })
  @ApiProperty({ type: () => Chat, isArray: true, description: "채팅 목록" })
  chats: Chat[];

  @OneToMany(() => ChatRoomUser, (chatRoomUser) => chatRoomUser.chatRoom, {
    cascade: true,
  })
  chatRoomUsers: ChatRoomUser[];
}
