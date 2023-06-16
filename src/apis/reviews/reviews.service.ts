import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { EnumRating, Review } from "./entities/reviews.entity";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UsersService } from "../users/users.service";
import { identity } from "rxjs";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>, // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  findAll({ page, order }): Promise<Review[]> {
    return this.reviewRepository.find({

      relations: ["user"], //"quickMatching"

      skip: (page - 1) * 4,
      take: 4,
      order: { createdAt: order },
    });
  }

  async findOne({ userId }): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { user: userId },
      relations: ["user"], //"quickMatching"

    });
  }

  create(createReviewDto: CreateReviewDto, user): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    // 저장할 때 chemirating에 user의 기본 점수인 45점 + 케미점수 해주기
    // 같은 리뷰 받은거 count 해서 sum 하기
    return this.reviewRepository.save({ ...review, user });
  }

  async sumRating({ userId, reviews }): Promise<number> {
    const userChemiRating = await this.usersService.findOneChemiRating(userId); //45
    console.log(userChemiRating, "11111111111111111");
    // const reviews = await this.reviewRepository.find({
    //   where: { user: userId },
    //   //relations: ["user"], // User와의 관계 설정
    // });
    //const user = await this.usersService.findOneEmail(userId); // 사용자 정보 가져오기
    // const reviews = user.review; // 사용자의 리뷰 가져오기

    console.log(userChemiRating, "22222222222222222", reviews);
    let sum = userChemiRating;
    // reviews.forEach((review) => {
    //   //sum += parseInt(review.chemiRating.toString());
    //   switch (review.chemiRating) {
    //     case EnumRating.BEST: //2
    //       sum += EnumRating.BEST;
    //       break;
    //     case EnumRating.GOOD: //1
    //       sum += EnumRating.GOOD;
    //       break;

    //     case EnumRating.DISAPPOINTING: //-1
    //       sum += EnumRating.DISAPPOINTING;
    //       break;

    //     case EnumRating.POOR: //-2
    //       sum += EnumRating.POOR;
    //       break;

    //     default:
    //       break;
    //   }
    // });

    // return sum;
    if (reviews) {
      reviews.forEach((review) => {
        switch (review.chemiRating) {
          case EnumRating.BEST:
            sum += EnumRating.BEST;
            break;
          case EnumRating.GOOD:
            sum += EnumRating.GOOD;
            break;
          case EnumRating.DISAPPOINTING:
            sum += EnumRating.DISAPPOINTING;
            break;
          case EnumRating.POOR:
            sum += EnumRating.POOR;
            break;
          default:
            break;
        }
      });
    }

    return sum;
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
