import { ApiProperty } from "@nestjs/swagger";
import {
  AgeGroup,
  Gender,
  QuickMatching,
} from "../../quickmatchings/entities/quickmatchings.entity";

// export class CreateCheckInfoDto {
//   @ApiProperty({
//     description: "성별",
//     example: "Male = Male Female = Female",
//     enum: Gender,
//     //required: true,
//   })
//   targetGender: Gender;
//   @ApiProperty({
//     description: "유저 연령대",
//     example: "TEENAGER = TEENAGER ,TWENTIES = TWENTIES",
//     enum: AgeGroup,
//     //required: true,
//   })
//   targetAgeGroup: AgeGroup;
//   @ApiProperty({
//     description: "퀵매칭 id",
//     required: true,
//   })
//   quickMatchingId: QuickMatching;
// }
