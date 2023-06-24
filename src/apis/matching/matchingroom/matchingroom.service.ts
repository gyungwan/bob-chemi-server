import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  ParseEnumPipe,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/apis/users/entities/user.entity";
import { UsersService } from "src/apis/users/users.service";
import { Repository } from "typeorm";
import { MatchingChatService } from "../matchingchat/matchingchat.service";
import {
  AgeGroup,
  Gender,
  QuickMatching,
} from "../quickmatchings/entities/quickmatchings.entity";
import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
import { MatchingRoom } from "./entities/matchingroom.entity";

@Injectable()
export class MatchingRoomService {
  constructor(
    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>,
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @Inject(forwardRef(() => MatchingChatService))
    private matchingChatService: MatchingChatService,
    @Inject(forwardRef(() => QuickMatchingService))
    private quickMatchingService: QuickMatchingService
  ) {}

  async checkMatching({
    userId,
    targetGender,
    targetAgeGroup,
    quickMatchingId,
  }: {
    userId: string;
    targetGender: Gender;
    targetAgeGroup: AgeGroup;
    quickMatchingId: QuickMatching;
  }): Promise<MatchingRoom[]> {
    // const existingUser = await this.matchingRoomRepository.findOne({
    //   where: { user: { id: userId } },
    // });
    // if (existingUser) {
    //   throw new ConflictException("유저가 이미 매칭 요청을 하였습니다.");
    // }

    const user = await this.usersService.findOneId(userId); // 내정보
    // const quickMatching = await this.quickMatchingService.create(userId, {
    //   gender,
    //   ageGroup,
    // });

    // 매칭이 되는걸 matchingRoom 이라고 하고 그걸 save
    // const matchingRoom = new MatchingRoom();
    // matchingRoom.quickMatching = quickMatchingId;
    // //matchingRoom.user = user;
    // //matchingRoom.targetUser = targetUser;
    // matchingRoom.requestAgeGroup = targetAgeGroup;
    // matchingRoom.requestGender = targetGender;
    // matchingRoom.user = user;
    //const savedMatchingRoom = await this.matchingRoomRepository.save(
    //   matchingRoom
    // );
    const targetUser = await this.findTargetUser();
    if (!targetUser) {
      throw new NotFoundException("조건에 해당하는 유저를 찾을 수 없습니다.");
    }

    // const matchingRooms: Partial<MatchingRoom>[] = [];

    // for (const target of targetUser) {
    //   const matchingRoom: Partial<MatchingRoom> = {
    //     quickMatching: quickMatchingId,
    //     requestAgeGroup: targetAgeGroup,
    //     requestGender: targetGender,
    //     user: user,
    //     targetUser: target.user,
    //   };

    //   matchingRooms.push(matchingRoom);
    // }
    const savedMatchingRooms: MatchingRoom[] = [];
    for (const target of targetUser) {
      const matchingRoom = new MatchingRoom();
      matchingRoom.quickMatching = quickMatchingId;
      matchingRoom.requestAgeGroup = targetAgeGroup;
      matchingRoom.requestGender = targetGender;
      matchingRoom.user = user;
      matchingRoom.targetUser = target.user;
      matchingRoom.isMatched = true; // 매칭이 성공한 경우 항상 true로 저장

      const savedMatchingRoom = await this.matchingRoomRepository.save(
        matchingRoom
      );
      savedMatchingRooms.push(savedMatchingRoom);
    }

    console.log(savedMatchingRooms, "11111111111111111111111");
    //db 저장하는 save에 문제있음
    // const savedMatchingRoom = await this.matchingRoomRepository.save(
    //   matchingRooms
    // );

    //const targetUser = await this.findTargetUser();
    // const perfectMatching = await this.matchingRoomRepository.save(targetUser);
    // console.log(
    //   savedMatchingRoom,
    //   "=========================================="
    // );
    return savedMatchingRooms;
  }

  async findTargetUser(): Promise<QuickMatching[]> {
    // 1. isMatched ==false 인 모든 퀵매칭 요청을 찾아옴
    const quickMatching =
      await this.quickMatchingService.findAllRequestMatching();
    //console.log(quickMatching, "111111111111111111111111");

    // if (!quickMatching) {
    //   throw new NotFoundException("존재하는 매칭이 없습니다.");
    // } 나의 매칭 또한 들어가기 때문에 에러 안뜸

    //2. 조건 매칭
    // 나를 제외시켜야함
    // if (!targetUser) {//시간 제한으로 퀵매칭 유저가 없어도 기다려야함
    //   throw new NotFoundException("대상 사용 찾을 수 없습니다");
    // }
    const sortedMatching = quickMatching.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const succeedMatching: Partial<QuickMatching[]> = [];
    for (let i = 0; i < quickMatching.length; i++) {
      const applicant = quickMatching[i];
      //const userName = applicant.user.name;

      //const userId = applicant.user.id;
      // console.log(
      //   applicant,
      //   "+++++++++++++++++++++++++++++=",
      //   userId,
      //   userName
      // );
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
        const otherUserAge = otherUser.age;
        const otherUserAgeGroup = this.getAgeGroup(otherUserAge);

        if (
          // isMatched == true
          applicant.user.gender === otherUserTargetGender && // female ==
          userAgeGroup === otherUserTargetAgeGroup &&
          applicant.targetGender === otherUser.gender && // male == male
          applicant.targetAgeGroup === otherUserAgeGroup // 40 == 40
        ) {
          interface MatchedQuickMatching extends QuickMatching {
            MatchedUserName: string;
            MatchedUserId: string;
          }

          const matchedOtherUser: MatchedQuickMatching = {
            MatchedUserName: applicant.user.name,
            MatchedUserId: applicant.user.id,
            ...applicant,
            user: otherUser,
          };
          succeedMatching.push(matchedOtherUser);
          console.log(succeedMatching, "6666666666666666666666666");
          break;
        } else {
          throw new NotFoundException("해당되는 유저가 없습니다");
        }
      }

      // if (succeedMatching.length === 0) {
      //   // 해당되는 유저가 없을 경우 예외 처리
      //   throw new NotFoundException("해당되는 유저가 없습니다");
      // }

      if (succeedMatching.length > 0) {
        break; // 1대1 매칭
      }
    }

    return succeedMatching;
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
  async findOne(id): Promise<MatchingRoom> {
    const quickMatching = await this.matchingRoomRepository.findOne({
      where: { id },
      relations: ["user"], // matchingChat
    });
    console.log(quickMatching, "111111111");
    return quickMatching;
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

  async accept(quickMatchingId) {
    const matching = await this.quickMatchingService.findRequestMatching(
      quickMatchingId
    );
    await this.quickMatchingService.cancel(matching);
    // 매칭룸에 저장되고 퀵매칭에서는 삭제?
    matching.isMatched = true;
    console.log(matching, "3");

    await this.matchingRoomRepository.save(matching);

    // 매칭 채팅 생성 로직
    const matchingChat = await this.matchingChatService.createMatchingChat(
      matching
    );
    // matchingChat에 대한 추가 작업 수행

    return matchingChat; // 생성된 매칭 채팅 정보를 반환하거나 다른 응답을 선택할 수 있습니다.
  }
  // async reject(id) {
  //   //const perfectMatching = await this.findTargetUser()
  //   const quickMatching = await this.quickMatchingService.findRequestMatching(
  //     id
  //   );

  //   await this.quickMatchingRepository.remove(quickMatching);
  // }

  async delete(id) {
    const matchingRoom = await this.matchingRoomRepository.findOne({
      // where: { id: id },
      where: { id },
    });

    await this.matchingRoomRepository.softDelete(matchingRoom.id);
  }
}
