import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
//import { AuthGuard } from "nestjs";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./entities/reviews.entity";
import { ReviewsService } from "./reviews.service";

@ApiTags("REVIEW")
@ApiBadRequestResponse({ description: "잘못된 요청입니다" })
@ApiUnauthorizedResponse()
@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //@Param()은 URL 경로에서 동적인 값을 가져오는 데 사용되고
  //@Body()는 요청 본문에 포함된 데이터를 가져오는 데 사용
  //

  //조회
  @ApiOperation({ summary: "모든 리뷰 조회" })
  @Get()
  async fetchReviews(
    @Query("page") page: number = 1,
    @Query("order") order: string = "DESC"
  ): Promise<Review[]> {
    return this.reviewsService.findAll({ page, order });
  }

  //하나의 유저 리뷰 조회
  //@ApiOperation({ summary: "한 명의 유저 리뷰 조회" })
  //   @Get(":userId") // 앞에 reviews/:userId
  //   fetchReview(@Param("userId") userId: string): Promise<Review[]> {
  //     return this.reviewsService.findOne({ userId });
  //   }

  //리뷰 생성
  //@UseGuards(AuthGuard) // => 로그인이 && 매칭이 된 사람만 쓰기
  @ApiOperation({ summary: "리뷰 작성" })
  @Post()
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    //JSON 형식의 데이터를 전송하고 해당 데이터를 객체로 변환하여 사용
    return this.reviewsService.create(createReviewDto);
  }

  //리뷰 삭제
  //@UseGuards(AuthGuard)
  //   @Delete(":reviewId/:comicId") // : 는 경로 매개변수
  //   deleteReview(
  //     @Param("reviewId") reviewId: string,
  //     @Param("comicId") comicId: string
  //   ): Promise<boolean> {
  //     console.log("controller");
  //     return this.reviewsService.delete({ reviewId, comicId });
  //   }
}
