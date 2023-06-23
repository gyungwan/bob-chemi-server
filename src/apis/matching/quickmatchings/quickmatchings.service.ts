import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { classToPlain } from "class-transformer";
import { Repository } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { UsersService } from "../../users/users.service";
import { MatchingChat } from "../matchingchat/entities/matchingchat.entity";
import { MatchingRoom } from "../matchingroom/entities/matchingroom.entity";
import { MatchingRoomService } from "../matchingroom/matchingroom.service";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import {
  AgeGroup,
  Gender,
  QuickMatching,
} from "./entities/quickmatchings.entity";

@Injectable()
export class QuickMatchingService {
  constructor(
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => MatchingRoomService))
    private matchingRoomService: MatchingRoomService,
    @InjectRepository(MatchingRoom)
    private readonly matchingRoomRepository: Repository<MatchingRoom>
  ) {}

  async create(
    userId: string,
    {
      targetGender,
      targetAgeGroup,
    }: { targetGender: Gender; targetAgeGroup: AgeGroup }
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
    quickMatching.user = user;

    // MatchingRoom 생성 및 연결
    // const matchingRoom = new MatchingRoom();
    // matchingRoom.quickMatching = quickMatching;
    // //matchingRoom.matchingChat = null; // 매칭되면 채팅 생성 예정

    // const savedMatchingRoom = await this.matchingRoomRepository.save(
    //   matchingRoom
    // );
    // MatchingChat 생성 및 연결
    // const matchingChat = new MatchingChat();
    // matchingChat.matchingRoom = savedMatchingRoom;
    // matchingChat.message = "Hello, this is a message";
    // matchingChat.timestamp = new Date(); // 현재 시간으로 설정

    // const savedMatchingChat = await this.matchingChatRepository.save(
    //   matchingChat
    // );

    // matchingRoom.matchingChat = savedMatchingChat;

    //quickMatching.matchingRoom = savedMatchingRoom; // 매칭룸 저장

    // const savedQuickMatching = await this.quickMatchingRepository.save(
    //   quickMatching
    // );

    await this.quickMatchingRepository.save(quickMatching);
    const targetUser = await this.matchingRoomService.findTargetUser();
    //return this.quickMatchingRepository.save(quickMatching);
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
}
