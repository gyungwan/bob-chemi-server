import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Gender {
  Male = "Male",
  Female = "Female",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  @ApiProperty({ description: "유저 고유 아이디" })
  id: string;

  @Column()
  @ApiProperty({ description: "유저 이메일" })
  email: string;

  @Column()
  @ApiProperty({ description: "유저 비밀번호" })
  password: string;

  @Column()
  @ApiProperty({ description: "유저 전화번호" })
  phone: string;

  @Column()
  @ApiProperty({ description: "유저 닉네임" })
  nickname: string;

  @Column()
  @ApiProperty({ description: "유저 이름" })
  name: string;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: false,
  })
  @ApiProperty({ description: "유저 성별" })
  gender: Gender;

  @Column()
  @ApiProperty({ description: "유저 나이" })
  age: number;

  //   @Column()
  //   @ApiProperty({ description: "서비스 이용 약관 동의 여부" })
  //   agreement_use: boolean;

  //   @Column()
  //   @ApiProperty({ description: "마케팅 수신 동의 여부" })
  //   agreement_mkt: boolean;

  @Column()
  @ApiProperty({ description: "유저 생성일" })
  creadeAt: Date;

  @Column()
  @ApiProperty({ description: "유저 수정일" })
  updatedAt: Date;

  @Column()
  @ApiProperty({ description: "유저 탈퇴" })
  deletedAt: Date;
}
