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
  Put,
  Patch,
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
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { UsersService } from "../users/users.service";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Review } from "./entities/reviews.entity";
import { ReviewsService } from "./reviews.service";
import { Request } from "express";
@ApiTags("REVIEW API")
@ApiResponse({ status: 200, description: "성공" })
@ApiBadRequestResponse({ description: "잘못된 요청입니다" }) // 공통 응답코드 (i.e 400,401,402,404)
@ApiUnauthorizedResponse({ description: "인증되지 않았습니다." }) // 공통 응답코드 (i.e 400,401,402,404)
// 매칭되지 않았습니다. 필요
@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService
  ) {}

  //@Param()은 URL 경로에서 동적인 값을 가져오는 데 사용되고(get, patch, delete)
  //@Body()는 요청 본문에 포함된 데이터를 가져오는 데 사용(post,patch,put)
  //

  //----------------- 모든 리뷰 조회 -----------------------//

  @Get()
  @ApiOperation({
    summary: "모든 리뷰 조회",
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
  // userId 못 받아옴
  @Get(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "유저의 리뷰 조회",
  })
  async fetchReview(
    // @Request() request: any,
    @Param("id") id: any
  ): Promise<Review[]> {
    //const userId = request.user.id; // req는 미들웨어(passport, jwt 필요)
    console.log("1111111111111111111111111111", id);

    const userId = await this.usersService.findOneEmail(id);
    console.log("1111111111111111111111111111");
    return this.reviewsService.findOne({ userId: userId.id });
  }

  //----------------- 유저의 케미지수 조회 -----------------------//
  // @Get(":id/chemiRating")
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "유저의 케미지수 조회" })

  // async fetchChemiRating(@Req() req: Request, @Param("id") id: string) {
  //   const userId = (req.user as any).id;
  //   return this.usersService.findOneChemiRating(userId);
  // }

  //----------------- 유저의 케미지수 계산 -----------------------//
  // @Patch("/chemiRating")
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "케미지수 계산" })
  // async calculateChemiRating(@Req() req: Request) {
  //   const userId = (req.user as any).id;
  //   //console.log(userId); 가져와짐
  //   const reviews = req.body.reviewId;
  //   const sum = await this.reviewsService.sumRating({ userId, reviews });
  //   //const user = await this.usersService.findOneChemiRating({ userId });
  //   const totalChemiRating = sum; // + user;
  //   console.log(totalChemiRating);
  //   await this.reviewsService.updateChemiRating(userId, totalChemiRating);

  //   return { chemiRating: totalChemiRating };
  // }
  //----------------- 생성 -----------------------//
  @Post()
  @UseGuards(RestAuthAccessGuard) // => 로그인이 && 매칭이 된 사람만 쓰기
  @ApiOperation({ summary: "리뷰 작성" })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request
  ): Promise<Review> {
    //JSON 형식의 데이터를 전송하고 해당 데이터를 객체로 변환하여 사용
    const userId = (req.user as any).id;
    const user = await this.usersService.findOneEmail(userId);

    return this.reviewsService.create(createReviewDto, user);
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
