import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsersService } from "src/apis/users/users.service";
import { Repository } from "typeorm";
import { ChatRoom } from "./entities/chatRooms.entity";
import { ChatRoomUser } from "./entities/chatRoomUsers.entity";
import { Chat } from "./entities/chats.entity";

@Injectable()
export class GroupChatService {
  @InjectRepository(ChatRoom)
  private chatRoomRepository: Repository<ChatRoom>;
  private readonly chatRooms: Map<string, ChatRoom> = new Map();

  @InjectRepository(Chat)
  private chatRepository: Repository<Chat>;

  @InjectRepository(ChatRoomUser)
  private chatRoomUserRepository: Repository<ChatRoomUser>;

  constructor(private readonly usersService: UsersService) {}

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
  async getRooms(): Promise<ChatRoom[]> {
    return this.chatRoomRepository.find();
  }

  //<<------------방 검색------------>>
  async findRoom(chatRoomId: string): Promise<ChatRoom> {
    const room = await this.chatRoomRepository.findOne({
      where: { chatRoomId },
    });
    return room;
  }

  //<<------------방 참여------------>>
  async joinRoom(chatRoomId: string, userId: string): Promise<string> {
    const room = await this.findRoom(chatRoomId);
    const user = await this.usersService.findOneId(userId);

    if (!room) {throw new ConflictException("존재하지 않는 채팅방 입니다.")} //prettier-ignore
    if (!user) {throw new ConflictException("존재하지 않는 유저입니다.")} //prettier-ignore

    const isUser = await this.chatRoomUserRepository.findOne({
      where: {
        chatRoom: { chatRoomId: room.chatRoomId },
        user: { id: user.id },
      },
    });

    if (isUser) {
      throw new ConflictException("이미 가입된 채팅방입니다.");
    }

    const chatRoomUser = new ChatRoomUser();
    chatRoomUser.chatRoom = room;
    chatRoomUser.user = user;

    await this.chatRoomUserRepository.save(chatRoomUser);

    return "참여 완료";
  }
  //<<------------방 나가기------------>>

  async leaveRoom(chatRoomId: string, userId: string): Promise<boolean> {
    const chatRoom = await this.findRoom(chatRoomId);
    if (!chatRoom) {
      throw new ConflictException("존재하지 않는 채팅방입니다.");
    }

    const user = await this.usersService.findOneId(userId);
    if (!user) {
      throw new ConflictException("존재하지 않는 유저입니다.");
    }

    await this.chatRoomUserRepository.softDelete({
      chatRoom: { chatRoomId: chatRoom.chatRoomId },
      user: { id: user.id },
    });

    return true;
  }
  //<<------------방 삭제------------>>

  async deleteRoom(chatRoomId: string): Promise<boolean> {
    await this.chatRooms.delete(chatRoomId);
    return true;
  }

  //<<------------채팅 보내기------------>>
  async addChat(
    chatRoomId: string,
    message: string,
    userId: string
  ): Promise<Chat> {
    if (!message) {
      throw new BadRequestException("메세지를 입력해 주세요");
    }

    const chatRoom = await this.findRoom(chatRoomId);
    if (!chatRoom) {
      throw new ConflictException("존재하지 않는 채팅방 입니다.");
    }

    const user = await this.usersService.findOneId(userId);
    if (!user) {
      throw new ConflictException("존재하지 않는 유저입니다.");
    }

    const chat: Chat = {
      chatId: Date.now().toString(),
      message,
      user,
      chatRoom,
    };
    console.log(chat, "@@@@@@@@@@@@@@@@@@@@");

    if (!chatRoom.chats) {
      chatRoom.chats = [];
    }
    chatRoom.chats.push(chat);
    await this.chatRepository.save(chat);
    return chat;
  }
}
