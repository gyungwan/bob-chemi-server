import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { ChatRoom } from "./chat.rooms.entity";

@Entity()
export class Chat {
  @PrimaryColumn()
  @ApiProperty({ description: "채팅 고유 ID" })
  chatId: string;

  @Column()
  @ApiProperty({ description: "채팅 메세지" })
  message: string;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chats)
  chatRoom: ChatRoom;
}
