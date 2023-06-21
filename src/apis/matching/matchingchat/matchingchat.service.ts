import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { MatchingChat } from "./entities/matchingchat.entity";

@Injectable()
export class MatchingChatService {
  constructor(
    @InjectRepository(MatchingChat)
    private readonly matchingchatRepository: Repository<MatchingChat>
  ) {}

  async addChatLog(log: string): Promise<MatchingChat> {
    // 채팅기록 추가
    const matchingChat = new MatchingChat();
    matchingChat.log = log;
    return this.matchingchatRepository.save(matchingChat);
  }

  async getAllChatLogs(): Promise<MatchingChat[]> {
    // 모든 채팅기록 조회
    return this.matchingchatRepository.find();
  }

  // 유저의 모든 채팅 기록 보기

  async getUserChatLogs(userId): Promise<MatchingChat[]> {
    return this.matchingchatRepository.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],

      //
    });
  }

  // 유저의 채팅방의 기록 보기
  async checkChatByRoomId(
    userId: string,
    roomId: string
  ): Promise<MatchingChat[]> {
    return this.matchingchatRepository.find({
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
}
