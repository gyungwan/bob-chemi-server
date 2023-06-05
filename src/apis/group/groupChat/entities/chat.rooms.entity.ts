import { ApiProperty } from "@nestjs/swagger";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Chat } from "./chats.entity";

@Entity()
export class ChatRoom {
  @PrimaryColumn()
  @ApiProperty({ description: "채팅방 고유 ID" })
  chatRoomId: string;

  @OneToMany(() => Chat, (chat) => chat.chatRoom)
  chats: Chat[];
}
