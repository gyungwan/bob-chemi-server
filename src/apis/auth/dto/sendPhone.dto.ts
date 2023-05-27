import { ApiProperty } from "@nestjs/swagger";

export class sendPhone {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "01012345678",
  })
  phone: string;
}

export class checkSms {
  @ApiProperty({
    description: "휴대폰 번호",
    example: "01012345678",
  })
  phone: string;
  @ApiProperty({
    description: "인증 번호",
    example: "1234",
  })
  token: string;
}
