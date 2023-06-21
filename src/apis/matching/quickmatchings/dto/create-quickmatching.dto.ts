import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
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
  @ApiProperty({
    description: "성별",
    example: "Male = Male Female = Female",
    enum: Gender,
    required: true,
  })
  gender: Gender;

  @ApiProperty({
    description: "유저 연령대",
    example: "TEENAGER = TEENAGER ,TWENTIES = TWENTIES",
    enum: AgeGroup,
    required: true,
  })
  ageGroup: AgeGroup;
}
