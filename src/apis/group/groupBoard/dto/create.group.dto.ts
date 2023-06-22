import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateGroupDto {
  @ApiProperty({
    description: "소모임 게시글 제목",
    example: "빵집 투어 갑시다",
    required: true,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "소모임 게시글 내용",
    example: "성심당 투어하실 빵순이 빵돌이 모집합니다.",
    required: true,
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: "소모임 모이는 날짜",
    example: "2023-05-31",
    required: true,
  })
  @IsNotEmpty()
  groupDate: Date;

  @ApiProperty({
    description: "소모임 인원 제한",
    example: "타입은 string이지만 인원 제한 로직때문에 숫자만 사용해야함",
    required: false,
  })
  @IsNotEmpty()
  groupPeopleLimit: string;

  @ApiProperty({
    description: "소모임 모이는 Hour",
    example: "string",
    required: true,
  })
  @IsNotEmpty()
  groupHour: string;

  @ApiProperty({
    description: "소모임 모이는 Min",
    example: "string",
    required: true,
  })
  @IsNotEmpty()
  groupMin: string;

  @ApiProperty({
    description: "소모임 모임 장소",
    example: "대전광역시 중구 대종로 480번길 15",
    required: true,
  })
  @IsNotEmpty()
  groupLocation: string;
}
