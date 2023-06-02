import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Group } from "./groups.entity";
import { MemberStatus } from "./members.status.enum";

@Entity()
export class Member {
  @ApiProperty({ description: "멤버 고유 ID" })
  @PrimaryGeneratedColumn("uuid")
  memberId: string;

  @ApiProperty({
    description: "멤버 가입 여부 [PENDING:대기 / CONFIRMED: 가입완료",
  })
  @Column({ default: MemberStatus.PENDING })
  status: MemberStatus;

  @ApiProperty({ description: " 멤버 가입 신청일시" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "가입 승인 일시" })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: "가입 거절 일시" })
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Group, (group) => group.members, { onDelete: "CASCADE" })
  group: Group;
}
