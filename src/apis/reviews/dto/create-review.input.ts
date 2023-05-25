// import { IsString, IsNumber } from 'class-validator';

// export class CreateReviewInput {
//   @IsString()
//   comicId: string;

//   @IsString()
//   userId: string;

//   @IsString()
//   content: string;

//   @IsNumber()
//   like: number;

//   @IsNumber()
//   rating: number;
// }

import { ApiProperty } from "@nestjs/swagger";
//import { Min } from "class-validator";

//@ApiProperty() Swagger 문서를 생성하기 위해 사용

export class CreateReviewInput {
  @ApiProperty({ description: "유저Id" })
  userId: string;

  @ApiProperty({ description: "빠른식사Id" })
  quickMatchingId: string;

  //@Min(0) //해당 필드의 값이 최소값으로 지정된 숫자(여기서는 0)보다 큰지를 검사
  @ApiProperty({ description: "케미 지수" })
  chemiRating: number;

  @ApiProperty({ description: "후기" })
  content: string;

  //   @ApiProperty({ description: "상품 카테고리 id" })
  //   productCategory: string;
}
