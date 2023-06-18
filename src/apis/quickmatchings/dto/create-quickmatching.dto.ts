import { ApiProperty } from "@nestjs/swagger";
import { AgeGroup, Gender } from "../entities/quickmatchings.entity";

// export enum Gender {
//     Male = "Male",
//     Female = "Female",
//   }

//   export const AgeGroup = [
//     { name: "10대", minAge: 10, maxAge: 19 },
//     { name: "20대", minAge: 20, maxAge: 29 },
//     { name: "30대", minAge: 30, maxAge: 39 },
//     { name: "40대", minAge: 40, maxAge: 49 },
//     { name: "50대", minAge: 50, maxAge: 59 },
//   ];
// 유저가 입력하는 것
export class CreateQuickMatchingDto {
  //나이 변환은 상대방의 나이를 변환에서 넣을 때 , 성별

  @ApiProperty({
    description: "성별",
    example: "Male = Male Female = Female",
    enum: Gender,
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: "유저 연령대",
    example: "TEENAGER = 10대,TWENTIES = 20대",
    enum: AgeGroup,
    required: true,
  })
  ageGroup: AgeGroup;
}
