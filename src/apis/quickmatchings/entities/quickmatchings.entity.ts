// 빠른식사(퀵매칭) - 거리 반경.. 
// [3키로  - 우리집 ^ 의정부역
// 4키로 - 우리집 ^ 회룡역
// 5키로 - 우리짐 ^ 망월사역]
import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

// 유저id - <성별,나이대,>
// 생성일
// 삭제일

import Ent

@Entity()
export class QuickMatching {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty()
    id: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt : Date;

    @ApiProperty()
    @DeleteDateColumn()
    deletedAt : Date;

    // 유저에서 성별,나이, 위치 가져오기? 

}