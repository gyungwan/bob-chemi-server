import { Injectable, NotFoundException } from "@nestjs/common";
import { GroupStatus } from "./entites/groups.status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entites/groups.entity";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Repository } from "typeorm";
import { UpdateGroupDto } from "./dto/update.group.dto";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>
  ) {}
  //<<------------소모임 게시글 조회------------>>
  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  //<<------------ID로 소모임 게시글 조회------------>>
  async getGroupById(id: any): Promise<Group> {
    const found = await this.groupRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`${id} 는 올바르지 않은 ID 입니다.`);
    }
    return found;
  }

  //<<------------소모임 게시글 생성------------>>
  createGroup(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(group);
  }

  //<<------------소모임 게시글 삭제------------>>
  async deleteGroupBoard(id: number): Promise<void> {
    const result = await this.groupRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${id}로 작성된 게시글이 없습니다.`);
    }
  }

  //<<------------소모임 게시글 수정------------>>
  async updateGroupBoard(
    id: string,
    updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    const group = await this.getGroupById(id);
    return this.groupRepository.save(group);
  }

  //<<------------소모임 게시글 구인 상태 변경------------>>
  async updateGroupStatus(id: string): Promise<Group> {
    const group = await this.getGroupById(id);

    if ((group.status = GroupStatus.PUBLIC)) {
      group.status = GroupStatus.PRIVATE;
    } else if ((group.status = GroupStatus.PRIVATE)) {
      group.status = GroupStatus.PUBLIC;
    }

    await this.groupRepository.save(group);
    return group;
  }
  //<<------------소모임 가입 신청------------>>
  applyGroup() {
    return "123";
  }
  //<<------------소모임 신청에 대한 수락------------>>
  acceptGroup() {
    return "123";
  }
  //<<------------소모임 신청에 대한 거절------------>>
  refuseGroup() {
    return "123";
  }
}
