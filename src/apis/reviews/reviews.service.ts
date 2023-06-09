import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnumRating, Review } from "./entities/reviews.entity";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UsersService } from "../users/users.service";
import { identity } from "rxjs";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>, // @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService
  ) {}

  findAll({ page, order }): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ["user", "quickMatching"],
      skip: (page - 1) * 4,
      take: 4,
      order: { createdAt: order },
    });
  }

  findOne({ userId }): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user: userId },
      relations: ["user", "quickMatching"],
    });
  }

  create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);
    // 저장할 때 chemirating에 user의 기본 점수인 45점 + 케미점수 해주기
    // 같은 리뷰 받은거 count 해서 sum 하기
    return this.reviewRepository.save(review);
  }

  async sumRating({ userId }): Promise<number> {
    const userChemiRating = await this.usersService.calculateChemiRating(
      userId
    );
    const reviews = await this.reviewRepository.find({
      where: { user: userId },
    });

    let sum = userChemiRating;
    reviews.forEach((review) => {
      //sum += parseInt(review.chemiRating.toString());
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

    return sum;
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
