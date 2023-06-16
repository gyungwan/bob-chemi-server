import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Max, Min } from "class-validator";

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

  @Min(2)
  @Max(10)
  @ApiProperty({
    description: "소모임 인원 제한",
    example: "2~10",
    required: false,
  })
  @IsNotEmpty()
  groupPeopleLimit: number;

  @Min(0)
  @Max(23)
  @ApiProperty({
    description: "소모임 모이는 Hour",
    example: "0~23",
    required: true,
  })
  @IsNotEmpty()
  groupHour: number;

  @Min(0)
  @Max(59)
  @ApiProperty({
    description: "소모임 모이는 Min",
    example: "0~59",
    required: true,
  })
  @IsNotEmpty()
  groupMin: number;

  @ApiProperty({
    description: "소모임 모임 장소",
    example: "대전광역시 중구 대종로 480번길 15",
    required: true,
  })
  @IsNotEmpty()
  groupLocation: string;
}
