import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";

import { Socket } from "socket.io";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { MatchingChat } from "./entities/matchingchat.entity";
import { MatchingRoom } from "../quickmatchings/entities/matchingroom.entity";
@Injectable()
export class MatchingChatService {
  constructor(
    @InjectRepository(MatchingChat)
    private readonly matchingChatRepository: Repository<MatchingChat>,
    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>,
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>
  ) {}

  async createMatchingChat(matchingRoomId): Promise<MatchingChat> {
    // Check if the matching room exists
    const matchingRoom = await this.matchingRoomRepository.findOne(
      matchingRoomId
    );
    if (!matchingRoom) {
      throw new NotFoundException("Matching room not found");
    }

    // Create a new matching chat
    const matchingChat = new MatchingChat();
    matchingChat.matchingRoom = matchingRoom;

    // Save the matching chat
    return this.matchingChatRepository.save(matchingChat);
  }

  async addChatLog(log: string): Promise<MatchingChat> {
    // 채팅기록 추가
    const matchingChat = new MatchingChat();
    matchingChat.log = log;
    return this.matchingChatRepository.save(matchingChat);
  }

  async getAllChatLogs(): Promise<MatchingChat[]> {
    // 모든 채팅기록 조회
    return this.matchingChatRepository.find();
  }

  // 유저의 모든 채팅 기록 보기

  async getUserChatLogs(userId): Promise<MatchingChat[]> {
    return this.matchingChatRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],

      //
    });
  }

  // 유저의 채팅방의 기록 보기
  async checkChatByRoomId(
    userId: string,
    roomId: string
  ): Promise<MatchingChat[]> {
    return this.matchingChatRepository.find({
      where: [
        { sender: { id: userId }, roomId },
        { receiver: { id: userId }, roomId },
      ],
    });
  }

  async leaveChatRoom(userId: string, roomId: string): Promise<void> {
    // 채팅방에서 유저를 제거하는 로직을 구현합니다.
    // 예를 들어, 채팅방의 참여자 목록에서 해당 유저를 제거하거나
    // 채팅방의 상태를 업데이트하여 해당 유저를 제외한 참여자만 남도록 처리할 수 있습니다.
    // 필요에 따라 데이터베이스 작업 등을 수행할 수 있습니다.
  }

  //-------------- 경완 수정 부분 ----------

  async create(chat: MatchingChat): Promise<MatchingChat> {
    return this.matchingChatRepository.save(chat);
  }

  async deleteChatRoomMessages(roomId: string): Promise<void> {
    const user = await this.matchingChatRepository.findOne({
      where: { id: roomId },
      relations: ["matchingRoom", "matchingRoom.user1", "matchingRoom.user2"],
    });
    if (
      user &&
      user.matchingRoom &&
      user.matchingRoom.user1 &&
      user.matchingRoom.user2
    ) {
      await this.quickMatchingRepository.delete(user.matchingRoom.user1.id);
      await this.quickMatchingRepository.delete(user.matchingRoom.user2.id);
    }
    await this.matchingChatRepository.delete({ matchingRoom: { id: roomId } });
  }

  async getChatHistory(chatRoomId: string): Promise<MatchingChat[]> {
    return this.matchingChatRepository.find({
      where: { roomId: chatRoomId },
      order: { timestamp: "ASC" }, // Optional: Sort the chat messages by timestamp
    });
  }

  async test(client: Socket, data) {
    console.log(data);
    client.emit("test", { message: "test" });
  }
}
