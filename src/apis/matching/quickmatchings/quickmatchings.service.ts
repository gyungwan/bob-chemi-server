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
    private readonly userRepository: Repository<User>
  ) {}

  async create(
    userId: string,
    { gender, ageGroup }: { gender: Gender; ageGroup: AgeGroup }
  ): Promise<QuickMatching> {
    const existingMatching = await this.quickMatchingRepository.findOne({
      where: { user: { id: userId } },
    });
    if (existingMatching) {
      // 이미 생성된 QuickMatching이 있을 경우 예외 처리 또는 중복 생성 방지 로직을 수행해야 합니다.
      throw new ConflictException("QuickMatching already exists");
    }

    const user = await this.usersService.findOneId(userId); // My Info

    // const myGender = user.gender;
    // const myAge = user.age;
    // const myAgeGroup = this.getAgeGroup(myAge);

    // QuickMatching 객체 생성 및 저장
    const quickMatching = new QuickMatching();
    quickMatching.gender = gender;
    quickMatching.ageGroup = ageGroup;
    quickMatching.user = user;

    return this.quickMatchingRepository.save(quickMatching);
  }
  // async findMatchedUser(gender, ageGroup): Promise<User | undefined> {
  //   //const matchedUser = await.usersService.findOneId()
  // }

  async findOne(id): Promise<QuickMatching> {
    const quickMatching = await this.quickMatchingRepository.findOne({
      where: { id },
      relations: ["user"], // matchingChat
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
    await this.quickMatchingRepository.softDelete(id);
  }
}
