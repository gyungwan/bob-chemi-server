import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
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

  @ManyToOne(() => User, (user) => user.chats)
  @ApiProperty({ description: "사용자" })
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chats)
  chatRoom: ChatRoom;
}
