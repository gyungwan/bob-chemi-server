import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Req,
  Request,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";


//import { AuthGuard } from "nestjs";

import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./entities/reviews.entity";
import { ReviewsService } from "./reviews.service";

@ApiTags("REVIEW")

@ApiResponse({ status: 200, description: "성공" })
@ApiBadRequestResponse({ description: "잘못된 요청입니다" }) // 공통 응답코드 (i.e 400,401,402,404)
@ApiUnauthorizedResponse({ description: "인증되지 않았습니다." }) // 공통 응답코드 (i.e 400,401,402,404)
// 매칭되지 않았습니다. 필요
@Controller("reviews")
@ApiTags("리뷰API")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  //@Param()은 URL 경로에서 동적인 값을 가져오는 데 사용되고(get, patch, delete)
  //@Body()는 요청 본문에 포함된 데이터를 가져오는 데 사용(post,patch,put)
  //


  //----------------- 모든 리뷰 조회 -----------------------//

  @ApiOperation({ summary: "모든 리뷰 조회" })
  @Get()
  @ApiOperation({
    summary: "모든 리뷰 조회",
    description: "모든 리뷰를 조회한다",
  })
  // @ApiNotFoundResponse({
  //   type: ReviewError,
  //   description: "존재하지 않는 이메일입니다.",
  // })
  async fetchReviews(
    @Query("page") page: number = 1,
    @Query("order") order: string = "DESC"
  ): Promise<Review[]> {
    return this.reviewsService.findAll({ page, order });
  }
  //----------------- 유저의 리뷰 조회 -----------------------//
  // @Get(":id") // 앞에 reviews/:userId
  // @ApiOperation({ summary: "한 명의 유저 리뷰 조회" })
  // fetchReview(@Req() req: Request, @Param("id") id: string): Promise<Review[]> {
  //   const id = req.user.id;
  //   return this.reviewsService.findOne({ id });
  // }

  // @Get(":id")
  // async fetchReview(
  //   @Request() request: any,
  //   @Param("id") id: string
  // ): Promise<Review[]> {
  //   const userId = req.user.id; // req는 미들웨어(passport, jwt 필요)
  //   return this.reviewsService.findOne({ userId });
  // }

  //----------------- 생성 -----------------------//
  @Post()
  //@UseGuards(AuthGuard) // => 로그인이 && 매칭이 된 사람만 쓰기
  @ApiOperation({ summary: "리뷰 작성", description: "유저가 리뷰를 작성한다" })

  //하나의 유저 리뷰 조회
  //@ApiOperation({ summary: "한 명의 유저 리뷰 조회" })
  //   @Get(":userId") // 앞에 reviews/:userId
  //   fetchReview(@Param("userId") userId: string): Promise<Review[]> {
  //     return this.reviewsService.findOne({ userId });
  //   }

  //리뷰 생성
  //@UseGuards(AuthGuard) // => 로그인이 && 매칭이 된 사람만 쓰기

  
  createReview(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    //JSON 형식의 데이터를 전송하고 해당 데이터를 객체로 변환하여 사용
    return this.reviewsService.create(createReviewDto);
  }

  //----------------- 삭제 -----------------------//
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
