import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

  // 유저의 채팅방의 기록 보기

  //
}
