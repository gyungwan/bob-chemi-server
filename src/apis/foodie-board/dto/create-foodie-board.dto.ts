import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";

export class CreateFoodieBoardDto {
  @ApiProperty({ description: "맛집 게시물 제목" })
  title: string;

  @ApiProperty({ description: "맛집 게시물 내용" })
  content: string;
}
