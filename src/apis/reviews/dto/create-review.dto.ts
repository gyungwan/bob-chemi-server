import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";
import { EnumRating, EnumValue } from "../entities/reviews.entity";

// export enum EnumRating {
//   BEST = 2,
//   GOOD = 1,
//   DISAPPOINTING = -1,
//   POOR = -2,
// }

// export enum EnumValue {
//   "최고에요" = EnumRating.BEST,
//   "좋아요" = EnumRating.GOOD,
//   "아쉬워요" = EnumRating.DISAPPOINTING,
//   "별로에요" = EnumRating.POOR,
// }

export class CreateReviewDto {
  // @ApiProperty({})
  // userId: string;

  @Min(-2)
  @Max(2)
  @IsNumber()
  @ApiProperty({
    //example: EnumRating.BEST,
    example: [2, 1, -1, -2],
    description: "케미 지수",
    enum: EnumRating,
    //enum: EnumRating as unknown as number[],
    //enum: Object.values(EnumRating),
    enumName: "EnumRating",
    required: true,
  })
  chemiRating: EnumRating;

  @ApiProperty({
    //example: Object.keys(EnumValue).find((key) => EnumValue[key] === 2),
    example: ["최고에요", "좋아요", "아쉬워요", "별로에요"],
    description: "리뷰",
    enum: Object.values(EnumValue),
    enumName: "EnumValue",
    required: true,
  })
  content: EnumValue;
}
