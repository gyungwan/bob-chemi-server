import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Max, Min } from "class-validator";
export class CreateReviewDto {
  @Min(0)
  @Max(5)
  @IsNumber()
  @ApiProperty({
    example: 1.5,
    description: "케미 지수",
    required: true,
  })
  chemiRating: number;

  @ApiProperty({
    example: "친절해요",
    description: "리뷰",
    required: true,
  })
  @IsString()
  content: string;
}
