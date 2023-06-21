import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EnumRating, Review } from "./entities/reviews.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, getConnection, Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UsersService } from "../users/users.service";
import { identity } from "rxjs";
import { User } from "../users/entities/user.entity";
import { IReviewsServiceFindOne } from "./interfaces/review.interface";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>, // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private connection: Connection,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findAll({ page, order }): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ["user", "quickMatching"], //"quickMatching"

      skip: (page - 1) * 4,
      take: 4,
      order: { createdAt: order },
    });
  }

  // async findOne({ userId }: { userId: string }): Promise<Review[]> {
  //   return await this.connection
  //     .getRepository(Review)
  //     .createQueryBuilder("review")
  //     .leftJoinAndSelect("review.user", "user")
  //     .where("user.id = :userId", { userId })
  //     .getMany();

  //   //   async findOne({ id }: IReviewsServiceFindOne): Promise<Review[]> {
  //   //     return await this.reviewRepository.find({
  //   //       where: { user: { id } },
  //   //       relations: ["user"], // quickmatcing
  //   //     });
  //   //where: { user: userId },
  //   //relations: ["user"], //"quickMatching"
  // }

  async findOne({ id }): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user: { id } },
      relations: ["user", "quickmatching"], // quickmatcing
    });
    //where: { user: userId },
    //relations: ["user"], //"quickMatching"
  }
  //-----유저 리뷰생성,케미지수 ------
  async create(createReviewDto: CreateReviewDto, user): Promise<Review> {
    const userChemi = await this.sumRating(createReviewDto, user);

    // async findOne({ userId }): Promise<Review[]> {
    //   return await this.reviewRepository.find({
    //     where: { user: userId },
    //     relations: ["User"], //"quickMatching"
    //   });
    // }

    const review = await this.reviewRepository.create(createReviewDto);

    // 저장할 때 chemirating에 user의 기본 점수인 45점 + 케미점수 해주기
    // 같은 리뷰 받은거 count 해서 sum 하기

    user.chemiRating = userChemi;
    console.log(user);
    await this.userRepository.save(user);
    return await this.reviewRepository.save({ ...review, user: user });
  }

  // ------- 유저 케미지수 연산  ------
  async sumRating(createReviewDto: CreateReviewDto, user: User) {
    const { chemiRating } = createReviewDto;
    let updatedChemiRating = user.chemiRating;
    console.log(user);
    if (chemiRating) {
      switch (chemiRating) {
        case EnumRating.BEST:
          updatedChemiRating += EnumRating.BEST;
          break;
        case EnumRating.GOOD:
          updatedChemiRating += EnumRating.GOOD;
          break;
        case EnumRating.DISAPPOINTING:
          updatedChemiRating += EnumRating.DISAPPOINTING;
          break;
        case EnumRating.POOR:
          updatedChemiRating += EnumRating.POOR;
          break;
        default:
          break;
      }
    }

    return updatedChemiRating;
  }
  async updateChemiRating(id, newChemiRating: number) {
    const user = await this.usersService.findOneEmail(id);
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    user.chemiRating = newChemiRating;
    return this.userRepository.save(user); // user
  }

  //   update(
  //     reviewId: string,
  //     updateReviewInput: UpdateReviewInput
  //   ): Promise<Review> {
  //     return this.reviewRepository.save({ reviewId, ...updateReviewInput });
  //   }

  //   async delete(reviewId: string): Promise<boolean> {
  //     const result = await this.reviewRepository.delete(reviewId);
  //     return result.affected > 0;
  //   }
}
