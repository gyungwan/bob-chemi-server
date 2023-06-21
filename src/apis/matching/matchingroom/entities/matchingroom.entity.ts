import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MatchingChat } from "../../matchingchat/entities/matchingchat.entity";
import { QuickMatching } from "../../quickmatchings/entities/quickmatchings.entity";

@Entity()
export class MatchingRoom {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "boolean", default: false })
  @ApiProperty({ description: "매칭 여부" })
  isMatched: boolean;

  @OneToOne(() => QuickMatching, (quickMatching) => quickMatching.matchingRoom)
  quickMatching: QuickMatching;

  @OneToOne(() => MatchingChat, (matchingChat) => matchingChat.matchingRoom)
  matchingChat: MatchingChat;
}
