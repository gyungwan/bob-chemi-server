import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Review } from "./entities/reviews.entity";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review> // @Inject(forwardRef(() => UsersService))
  ) // private readonly usersService: UsersService
  {}

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
    return this.reviewRepository.save(review);
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
