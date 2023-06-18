import { ApiProperty } from "@nestjs/swagger";
import { Gender } from "../entities/user.entity";

export class UserProfileDto {
  @ApiProperty({ description: "유저 id" })
  id?: string;

  @ApiProperty({ description: "유저 이메일" })
  email?: string;

  @ApiProperty({ description: "유저 전화번호" })
  phone?: string;

  @ApiProperty({ description: "유저 이름" })
  name?: string;

  @ApiProperty({ description: "유저 닉네임" })
  nickname?: string;

  @ApiProperty({
    description: "유저 성별 Male = Male Female = Female",
    example: "Male = Male Female = Female 두가지 중 하나 만 넘어올수 있습니다.",
  })
  gender?: Gender;

  @ApiProperty({ description: "유저 나이" })
  age?: number;
}
