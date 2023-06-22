import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { Chat } from "./entities/chats.entity";

@Injectable()
export class GroupChatService {
  @InjectRepository(ChatRoom)
  private chatRoomRepository: Repository<ChatRoom>;

  private readonly chatRooms: Map<string, ChatRoom> = new Map();

  //<<------------방 생성------------>>
  async createRoom(roomName: string): Promise<ChatRoom> {
    const chatRoom = new ChatRoom();
    chatRoom.roomName = roomName;
    chatRoom.chats = [];

    await this.chatRooms.set(chatRoom.chatRoomId, chatRoom);
    await this.chatRoomRepository.save(chatRoom);

    return chatRoom;
  }

  //<<------------방 조회------------>>
  getRooms(): ChatRoom[] {
    return Array.from(this.chatRooms.values());
  }

  //<<------------채팅방 검색------------>>
  findRoom(roomName: string): ChatRoom | undefined {
    return this.chatRooms.get(roomName);
  }

  //<<------------채팅방 삭제------------>
  deleteRoom(roomName: string): boolean {
    return this.chatRooms.delete(roomName);
  }

  //<<------------채팅 보내기------------>>
  addChat(roomName: string, message: string): Chat {
    const chatRoom = this.findRoom(roomName);
    if (!chatRoom) {
      return null;
    }
    const chat: Chat = {
      chatId: Date.now().toString(),
      message,
      chatRoom,
    };
    chatRoom.chats.push(chat);
    return chat;
  }
}
