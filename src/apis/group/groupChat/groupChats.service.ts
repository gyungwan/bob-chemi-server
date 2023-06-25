import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/apis/users/entities/user.entity";
import { UsersService } from "src/apis/users/users.service";
import { Repository } from "typeorm";
import { ChatRoom } from "./entities/chat.rooms.entity";
import { Chat } from "./entities/chats.entity";

@Injectable()
export class GroupChatService {
  @InjectRepository(ChatRoom)
  private chatRoomRepository: Repository<ChatRoom>;

  private readonly chatRooms: Map<string, ChatRoom> = new Map();

  @InjectRepository(User)
  private userService: UsersService;
  private userRepository: Repository<User>;

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

  //<<------------방 검색------------>>
  findRoom(roomName: string): ChatRoom | undefined {
    return this.chatRooms.get(roomName);
  }

  //<<------------방 참여------------>>
  //<<------------방 나가기------------>>
  //<<------------방 삭제------------>>
  deleteRoom(roomName: string): boolean {
    return this.chatRooms.delete(roomName);
  }

  //<<------------채팅 보내기------------>>
  async addChat(
    chatRoomId: string,
    message: string,
    userId: string
  ): Promise<Chat> {
    const chatRoom = this.findRoom(chatRoomId);
    if (!chatRoom) {throw new ConflictException("존재하지 않는 채팅방 입니다.");} //prettier-ignore

    const user = await this.userService.findOneId(userId);
    if (!user) {throw new ConflictException("존재하지 않는 유저입니다.");} //prettier-ignore

    const chat: Chat = {
      chatId: Date.now().toString(),
      message,
      chatRoom,
      user,
    };
    chatRoom.chats.push(chat);
    return chat;
  }
}
