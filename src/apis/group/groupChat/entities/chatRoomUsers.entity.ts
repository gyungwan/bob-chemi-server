import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatRoom } from "./chatRooms.entity";

@Entity()
export class ChatRoomUser {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "ChatRoomUser 고유 ID" })
  id: number;

  @ManyToOne(() => User, (user) => user.chatRoomUsers)
  @ApiProperty({ description: "사용자" })
  user: User;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.chatRoomUsers)
  @ApiProperty({ description: "채팅방" })
  chatRoom: ChatRoom;
}
