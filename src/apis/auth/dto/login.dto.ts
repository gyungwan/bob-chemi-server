import { ApiProperty } from "@nestjs/swagger";

export class loginDto {
  @ApiProperty({ description: "이메일" })
  email: string;
  @ApiProperty({ description: "비밀번호" })
  password: string;
}
