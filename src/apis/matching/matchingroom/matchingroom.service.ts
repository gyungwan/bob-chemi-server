import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { identity } from "rxjs";
import { User } from "src/apis/users/entities/user.entity";
import { UsersService } from "src/apis/users/users.service";
import { Repository } from "typeorm";
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
    @Inject(forwardRef(() => QuickMatchingService))
    private quickMatchingService: QuickMatchingService
  ) {}

  async checkMatching({
    userId,
    myGender,
    myAgeGroup,
    targetGender,
    targetAgeGroup,
    quickMatchingId,
  }: {
    userId: string;
    myGender: Gender;
    myAgeGroup: string;
    targetGender: Gender;
    targetAgeGroup: AgeGroup;
    quickMatchingId: string;
  }): Promise<MatchingRoom> {
    // const existingUser = await this.matchingRoomRepository.findOne({
    //   where: { user: { id: userId } },
    // });
    // if (existingUser) {
    //   throw new ConflictException("유저가 이미 매칭 요청을 하였습니다.");
    // }

    const user = await this.usersService.findOneId(userId);
    // const quickMatching = await this.quickMatchingService.create(userId, {
    //   gender,
    //   ageGroup,
    // });

    const matchingRoom = new MatchingRoom();
    //matchingRoom.quickMatching = quickMatching;
    //matchingRoom.user = user;
    //matchingRoom.targetUser = targetUser;

    const savedMatchingRoom = await this.matchingRoomRepository.save(
      matchingRoom
    );

    // Check if there is a matching user in the matching room
    const targetUser = await this.findTargetUser(savedMatchingRoom);
    if (targetUser) {
      // 조건 비교
    }
    return savedMatchingRoom;
  }

  async findTargetUser(quickMatchingId): Promise<QuickMatching> {
    // 퀵매칭 요청을 찾아옴
    const quickMatching = await this.quickMatchingService.findRequestMatching(
      quickMatchingId
    ); // 퀵매칭, 유저 정보 같이
    console.log(quickMatching, "============================");

    if (!quickMatching) {
      throw new NotFoundException("매칭을 찾을 수 없습니다");
    }

    const targetUser = quickMatching.user; // 나를 제외시켜야함
    const targetAge = quickMatching.targetAgeGroup;
    const targetGender = quickMatching.targetGender;
    //const targetAgeGroup = this.getAgeGroup(targetAge);
    // if (!targetUser) {//시간 제한으로 퀵매칭 유저가 없어도 기다려야함

    //   throw new NotFoundException("대상 사용 찾을 수 없습니다");
    // }
    // const { targetGender, targetAgeGroup } = quickMatching; // 유저가 원하는 상대방의 조건인거잖아
    console.log(
      targetUser, // 결국 내 정보
      //gender,// 왜 타겟 젠더가 나오지?
      targetGender, // 왜 내 성별?
      //ageGroup, // 왜 타겟 나이?
      targetAge,
      //targetAgeGroup, // 왜 내 나이?
      "3333333333333333333"
    );
    // if (gender == targetGender && ageGroup == targetAgeGroup) {
    //   // 나의 아이디가 포함된건 제외해야 하잖아
    return quickMatching;
    // } else {
    //   throw new NotFoundException("조건에 일치하는 유저가 존재하지 않습니다");
    // }

    // 나온 퀵매칭 중에서 createdAt 제일 빠른애 순서로 정려 -> 제일 상위권인 애가 리턴되도록 하기
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
}
