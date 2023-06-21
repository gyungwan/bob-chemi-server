import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import { QuickMatching } from "./entities/quickmatchings.entity";

@Injectable()
export class QuickMatchingService {
  constructor(
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>,
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  //매칭된 것만 보여주기
  async create(
    // createQuickMatchingDto: CreateQuickMatchingDto,
    userId,
    { gender, ageGroup }: CreateQuickMatchingDto
  ): Promise<QuickMatching> {
    const user = await this.usersService.findOneId(userId);
    const quickMatching = await this.quickMatchingRepository.create({
      gender,
      ageGroup,
    });

    const myGender = user.gender; // 이미 user안에 gender가 있으니까..
    const myAge = user.age;
    const myAgeGroup = this.getAgeGroup(myAge);
    if (gender == myGender && ageGroup == myAgeGroup) {
      //조건이 맞다면 매칭을 만들어라
      // const quickMatching = await this.quickMatchingRepository.create({
      //   gender,
      //   ageGroup,
      // });
      quickMatching.isMatched = true;
      const matchedUser = console.log(quickMatching, "33333333333333333");
      //return quickMatching;
    } else {
      throw new BadRequestException(
        "매칭 조건에 해당하는 유저가 존재하지 않습니다."
      );
      //return quickMatching;
    }
    await this.userRepository.save(user);
    return await this.quickMatchingRepository.save({ ...quickMatching, user });
    // const matchedUser = await this.findMatchedUser(gender, ageGroup);
    // if (matchedUser) {
    //   quickMatching.isMa;
    // }
    // return this.quickMatchingRepository.save({
    //   ...quickMatching,
    //   ...myMatchingInfo,
    // });
    // 매칭이 성공했으므로 isMatched 값을 true로 변경
    // = true;
    // await this.quickMatchingRepository.save(createdMatching);
    // return createdMatching;
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
      relations: ["user", "quickmatching"], // matchingChat
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
