import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/apis/users/entities/user.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { GroupStatus } from "./groups.status.enum";
import { Member } from "./members.entity";

@Entity()
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "소모임 게시글 고유 ID" })
  groupId: number;

  @ApiProperty({ description: "소모임 게시글 제목" })
  @Column()
  title: string;

  @ApiProperty({ description: "소모임 게시글 내용" })
  @Column()
  description: string;

  @ApiProperty({ description: "소모임 모이는 날짜" })
  @Column({ type: Date })
  groupDate: Date;

  @ApiProperty({ description: "소모임 모이는 Hour" })
  @Column()
  groupHour: number;

  @ApiProperty({ description: "소모임 모이는 Min" })
  @Column()
  groupMin: number;

  @ApiProperty({ description: "소모임 모임 장소" })
  @Column()
  groupLocation: string;

  @ApiProperty({ description: "소모임 인원 제한" })
  @Column()
  groupPeopleLimit: number;

  @ApiProperty({
    description: "소모임 게시글 모집 여부 [PUBLIC:구인중 / PRIVATE:모집완]",
  })
  @Column({ default: GroupStatus.PUBLIC })
  status: GroupStatus;

  @ApiProperty({ description: "소모임 게시글 작성일시" })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: "소모임 게시글 수정일시" })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ description: "소모임 게시글 삭제일시" })
  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Member, (member) => member.group)
  members: Member[];

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
  users: User[];
}
