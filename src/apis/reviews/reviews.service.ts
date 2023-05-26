import { Injectable } from "@nestjs/common";
import { Review } from "./entities/reviews.entity";
import { CreateReviewInput } from "./dto/create-review.input";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  findAll({ page, order }): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ["user", "quickMatching"],
      skip: (page - 1) * 4,
      take: 4,
      order: { createdAt: order },
    });
  }

  //   findOne({ userId }): Promise<Review[]> {
  //     return this.reviewRepository.find({
  //       where: { user : userId  },
  //       relations: ["user", "quickMatching"],
  //     });
  //   }

  create(createReviewInput: CreateReviewInput): Promise<Review> {
    const review = this.reviewRepository.create(createReviewInput);
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
