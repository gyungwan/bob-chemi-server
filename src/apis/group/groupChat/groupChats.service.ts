import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Chat } from "./entities/chats.entity";

@Injectable()
export class GroupChatService {
  private chatRooms: Map<string, string[]> = new Map<string, string[]>();
  private chatRepository: Repository<Chat>;

  //<<------------메세지 발송------------>>
  async sendChat(chatId: string, message: string): Promise<Chat> {
    const chat = await this.chatRepository.save({ chatId, message });
    return chat;
  }

  //<<------------채팅 조회------------>>
  async getChat(): Promise<Chat[]> {
    return this.chatRepository.find();
  }

  //<<------------단체 채팅방 조회------------>>
  getChatRoom(chatRoomId: string) {
    return this.chatRooms.get(chatRoomId);
  }

  //<<------------채팅방 개설----------->>
  createChatRoom(chatRoomId: string) {
    this.chatRooms.set(chatRoomId, []);
  }

  //<<------------채팅방 참여------------>>
  joinChatRoom(chatRoomId: string, user: string) {
    const room = this.chatRooms.get(chatRoomId);
    if (room) {
      room.push(user);
    }
  }

  //<<------------채팅방 나가기------------>>
  leaveChatRoom(chatRoomId: string, user: string) {
    const room = this.chatRooms.get(chatRoomId);
    if (room) {
      const index = room.indexOf(user);
      if (index !== -1) {
        room.splice(index, 1);
      }
    }
  }

  //<<------------채팅 보내기------------>>
  sendMessage(chatRoomId: string, user: string, message: string) {
    const room = this.chatRooms.get(chatRoomId);
    if (room) {
      room.push(`${user}: ${message}`);
    }
  }
}
