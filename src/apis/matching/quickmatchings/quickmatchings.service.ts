import { CompressionType } from "@aws-sdk/client-s3";
import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";
import { ChatGateway } from "../ChatGateway/\bchatGateway";
import { MatchingChat } from "../matchingchat/entities/matchingchat.entity";
import { MatchingRoom } from "../matchingroom/entities/matchingroom.entity";
// import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import {
  AgeGroup,
  Gender,
  QuickMatching,
} from "./entities/quickmatchings.entity";
import { Socket } from "socket.io";
import { Client } from "socket.io/dist/client";

@Injectable()
export class QuickMatchingService {
  constructor(
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @Inject(forwardRef(() => MatchingRoomService))
    // private matchingRoomService: MatchingRoomService,
    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway
  ) {}

  async request(
    userId: string,
    socketId: string,
    {
      targetGender,
      targetAgeGroup,
      location,
    }: { targetGender: Gender; targetAgeGroup: AgeGroup; location: string }
  ): Promise<QuickMatching[]> {
    const existingMatching = await this.quickMatchingRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existingMatching) {
      // 이미 생성된 QuickMatching이 있을 경우 예외 처리 또는 중복 생성 방지 로직을 수행해야 합니다.
      throw new ConflictException("QuickMatching already exists");
    }

    const user = await this.usersService.findOneId(userId); // My Info
    // QuickMatching 객체 생성 및 저장
    const quickMatching = new QuickMatching();
    quickMatching.targetGender = targetGender;
    quickMatching.targetAgeGroup = targetAgeGroup;
    quickMatching.location = location;
    quickMatching.user = user;
    quickMatching.isMatched = false;

    // MatchingChat 생성 및 연결
    // const matchingChat = new MatchingChat();
    // matchingChat.matchingRoom = savedMatchingRoom;
    // matchingChat.message = "Hello, this is a message";
    // matchingChat.timestamp = new Date(); // 현재 시간으로 설정

    // const savedMatchingChat = await this.matchingChatRepository.save(
    //   matchingChat
    // );

    await this.quickMatchingRepository.save(quickMatching);
    const targetUser = await this.findTargetUser(socketId);
    return targetUser;
  }

  async findRequestMatching(id): Promise<QuickMatching> {
    const quickMatching = await this.quickMatchingRepository.findOne({
      where: { id },
      relations: ["user"], // matchingChat 유저의 정보까지 모두 반환
    });
    return quickMatching;
  }

  async findAllRequestMatching(): Promise<QuickMatching[]> {
    const quickMatching = await this.quickMatchingRepository.find({
      //where: { id },
      where: { isMatched: false },
      relations: ["user"], // matchingChat 유저의 정보까지 모두 반환
    });
    return quickMatching;
  }
  async cancel(id) {
    const quickMatching = await this.quickMatchingRepository.findOne({
      where: { id },
    });
    if (!quickMatching) {
      throw new NotFoundException("매칭을 찾을 수 없습니다.");
    }
    await this.quickMatchingRepository.remove(id); //remove
  }

  async updateIsMatched(
    applicant: QuickMatching,
    otherUser: QuickMatching
  ): Promise<void> {
    // matching.forEach(async (match) => {
    //   match.isMatched = true;
    //   await this.quickMatchingRepository.save(match);
    // });
    applicant.isMatched = true;
    otherUser.isMatched = true;
    await Promise.all([
      this.quickMatchingRepository.save(applicant),
      this.quickMatchingRepository.save(otherUser),
    ]);
  }

  async findMathedUser(id) {
    const matchingRoom = await this.matchingRoomRepository.findOne(id);
  }

  //----------------- MatchingRoom Service -----------------------//
  async findTargetUser(socketId: string): Promise<QuickMatching[]> {
    // 1. isMatched ==false 인 모든 퀵매칭 요청을 찾아옴
    const quickMatching = await this.findAllRequestMatching();

    //2. 조건 매칭

    const sortedMatching = quickMatching.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const succeedMatching: Partial<QuickMatching[]> = [];

    //const applicant: QuickMatching = quickMatching[i];
    for (let i = 0; i < quickMatching.length; i++) {
      //const applicant = quickMatching[i];

      const applicant: QuickMatching = quickMatching[i];
      //const userName = applicant.user.name;

      const userAge = applicant.user.age;
      const userAgeGroup = this.getAgeGroup(userAge);
      // 자신의 정보와 일치하지 않는 다른 유저들을 선택
      const otherUsers = quickMatching.filter(
        (match) => match.user.id !== applicant.user.id // 자신의 정보를 제외
      );

      for (let j = 0; j < otherUsers.length; j++) {
        const otherUser = otherUsers[j].user;
        const otherUserTargetAgeGroup = otherUsers[j].targetAgeGroup;
        const otherUserTargetGender = otherUsers[j].targetGender;
        const otherUserLocation = otherUsers[j].location;
        //const otherUserIsMatched = otherUsers[j].isMatched;
        const otherUserAge = otherUser.age;
        const otherUserAgeGroup = this.getAgeGroup(otherUserAge);

        // applicant.isMatched = true;
        // otherUser.quickMatching.isMatched = true;
        if (
          applicant.user.gender === otherUserTargetGender &&
          userAgeGroup === otherUserTargetAgeGroup &&
          applicant.targetGender === otherUser.gender &&
          applicant.targetAgeGroup === otherUserAgeGroup &&
          applicant.location == otherUserLocation
        ) {
          const matchingRoom = new MatchingRoom();
          matchingRoom.isMatched = true;
          matchingRoom.user1 = applicant.user;
          matchingRoom.user2 = otherUser;

          await this.matchingRoomRepository.save(matchingRoom);

          applicant.isMatched = true;
          otherUsers[j].isMatched = true;
          await Promise.all([
            this.quickMatchingRepository.save(applicant),
            this.quickMatchingRepository.save(otherUsers),
          ]);

          interface MatchedQuickMatching extends QuickMatching {
            MatchedUserName: string;
            MatchedUserId: string;
            //IsMatched : boolean
          }

          const matchedOtherUser: MatchedQuickMatching = {
            MatchedUserName: applicant.user.name,
            MatchedUserId: applicant.user.id,
            //IsMatched: applicant.isMatched,
            ...applicant,
            user: otherUser,
          };
          succeedMatching.push(matchedOtherUser);

          break;
        } else {
          throw new NotFoundException("해당되는 유저가 없습니다");
        }
      }

      if (succeedMatching.length === 0) {
        // 없을 경우 계속 반복하게 둬야 하는거 아닌가
        // 해당되는 유저가 없을 경우 예외 처리
        throw new NotFoundException("현재 매칭을 요청하는 유저가 없습니다");
      }

      if (succeedMatching.length > 0) {
        await this.processMatchings(socketId, succeedMatching);
        break;
      }
    }
    // console.log(matchingRoom, "33333638726423053098540986509");
    // if (matchingRoom) {
    //   await Promise.all([
    //     this.matchingRoomRepository.save(matchingRoom),
    //     this.matchingRoomRepository.save(succeedMatching),
    //   ]);
    // }
    //await this.matchingRoomRepository.save(succeedMatching);

    return succeedMatching;
  }
  async processMatchings(socketId: string, succeedMatching: QuickMatching[]) {
    for (let succeedMatchings of succeedMatching) {
      console.log("socket ----------------", succeedMatchings);
      if (
        succeedMatchings.matchingRoom &&
        succeedMatchings.matchingRoom.user1
      ) {
        const user1Id = succeedMatchings.matchingRoom.user1.id;
        const user2Id = succeedMatchings.matchingRoom.user2.id;
        const chatRoomId = succeedMatchings.matchingRoom.id;

        //socketId를 사용하여 연결된 소켓 가져오기
        const connectedSocket =
          this.chatGateway.server.sockets.sockets.get(socketId);
        if (connectedSocket) {
          // chatRoomId를 사용하여 방에 참여하십시오.

          connectedSocket.join(chatRoomId);

          // 클라이언트에 '참여한 방' 이벤트를 내보냅니다.
          connectedSocket.emit("joined room", chatRoomId);

          // 사용자에게 이제 연결되었음을 알립니다.
          this.chatGateway.onUsersMatched(user1Id, user2Id, chatRoomId);
        }
      }
    }
  }

  getAgeGroup(age: number): string {
    if (age >= 10 && age <= 19) {
      return "TEENAGER";
    } else if (age >= 20 && age <= 29) {
      return "TWENTIES";
    } else if (age >= 30 && age <= 39) {
      return "THIRTIES";
    } else if (age >= 40 && age <= 49) {
      return "FORTIES";
    } else if (age >= 50 && age <= 59) {
      return "FIFTIES";
    } else {
      return "기타";
    }
  }

  async findOne(id): Promise<User> {
    const quickMatching = await this.matchingRoomRepository.findOne({
      where: { id },
      relations: ["user1"], // matchingChat
    });
    const matchedUser = quickMatching.user1;
    console.log(matchedUser, "111111111");
    return matchedUser;
  }

  async performMatching(
    matchingRoom1: MatchingRoom,
    matchingRoom2: MatchingRoom
  ): Promise<void> {
    // Perform the matching logic here
    // Set isMatched property to true for both matching rooms
    matchingRoom1.isMatched = true;
    matchingRoom2.isMatched = true;

    // Update the matching rooms in the database
    await this.matchingRoomRepository.save([matchingRoom1, matchingRoom2]);

    // Additional logic for creating matching chat or other actions after successful matching
  }

  // async accept(quickMatchingId) {
  //   // 매칭된 유저 둘 다 수락해야 최종 매칭, save
  //   // 한명이 거절하면
  //   const matching = await this.findRequestMatching(
  //     quickMatchingId
  //   );
  //   await this.cancel(matching);
  //   // 매칭룸에 저장되고 퀵매칭에서는 삭제?
  //   matching.isMatched = true;
  //   console.log(matching, "3");

  //   await this.matchingRoomRepository.save(matching);

  //   // 매칭 채팅 생성 로직
  //   const matchingChat = await this.matchingChatService.createMatchingChat(
  //     matching
  //   );
  //   // matchingChat에 대한 추가 작업 수행

  //   return matchingChat; // 생성된 매칭 채팅 정보를 반환하거나 다른 응답을 선택할 수 있습니다.
  // }

  // async reject(id) {
  //   //const perfectMatching = await this.findTargetUser()
  //   const quickMatching = await this.quickMatchingService.findRequestMatching(
  //     id
  //   );

  //   await this.quickMatchingRepository.remove(quickMatching);
  // }

  async delete(id): Promise<void> {
    const matchingRoom = await this.matchingRoomRepository.findOne({
      // where: { id: id },
      where: { id },
    });

    const user1 = matchingRoom.user1;
    const user2 = matchingRoom.user2;

    await this.matchingRoomRepository.softDelete(matchingRoom.id);

    // const requestMatching1 = await this.quickMatchingRepository.findOne({
    //   where: { user: user1 },
    // });
    // await this.quickMatchingRepository.remove(requestMatching1);

    // const requestMatching2 = await this.quickMatchingRepository.findOne({
    //   where: { user: user2 },
    // });
    // await this.quickMatchingRepository.remove(requestMatching2);
  }
}
