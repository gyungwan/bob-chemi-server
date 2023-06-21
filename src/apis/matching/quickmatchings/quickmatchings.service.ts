import {
  BadRequestException,
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
import { QuickMatching } from "./entities/quickmatchings.entity";

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
    { gender, ageGroup }: CreateQuickMatchingDto,
    userId
    //{ gender, ageGroup }: CreateQuickMatchingDto
  ): Promise<QuickMatching> {
    const user = await this.usersService.findOneId(userId);
    const quickMatching = await this.quickMatchingRepository.create({
      gender,
      ageGroup,
    });
    console.log(quickMatching, "================================");

    await this.userRepository.save(user);
    return await this.quickMatchingRepository.save({
      user,
      gender,
      ageGroup,
    });
  }
  // async findMatchedUser(gender, ageGroup): Promise<User | undefined> {
  //   //const matchedUser = await.usersService.findOneId()
  // }
  getAgeGroup(age: number): string {
    if (age >= 10 && age <= 19) {
      return "10대";
    } else if (age >= 20 && age <= 29) {
      return "20대";
    } else if (age >= 30 && age <= 39) {
      return "30대";
    } else if (age >= 40 && age <= 49) {
      return "40대";
    } else if (age >= 50 && age <= 59) {
      return "50대";
    } else {
      return "기타";
    }
  }
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
