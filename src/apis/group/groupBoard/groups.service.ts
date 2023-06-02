import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GroupStatus } from "./entites/groups.status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entites/groups.entity";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Repository } from "typeorm";
import { UpdateGroupDto } from "./dto/update.group.dto";
import { Member } from "./entites/members.entity";
import { User } from "src/apis/users/entities/user.entity";
import { MemberStatus } from "./entites/members.status.enum";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private memberRepository: Repository<Member>,
    private userRepository: Repository<User>
  ) {}

  //<<------------소모임 조회------------>>
  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  //<<------------ID로 소모임 조회------------>>
  async getGroupById(groupId: string): Promise<Group> {
    const found = await this.groupRepository.findOne({ where: { groupId } });

    if (!found) {
      throw new NotFoundException(`${groupId} 는 올바르지 않은 ID 입니다.`);
    }
    return found;
  }

  //<<------------소모임 생성------------>>
  async createGroup(
    createGroupDto: CreateGroupDto,
    id: string
  ): Promise<Group> {
    const group = this.groupRepository.create(createGroupDto);
    const newGroup = await this.groupRepository.save(group);
    const user = await this.userRepository.findOne({ where: { id } });

    const owner = new Member(); // 게시글 작성자 자동 멤버 가입
    owner.group = newGroup;
    owner.user = user;
    owner.status = MemberStatus.CONFIRMED;

    await this.memberRepository.save(owner);

    return newGroup;
  }

  //<<------------소모임 게시글 삭제------------>>
  async deleteGroup(groupId: number): Promise<void> {
    const result = await this.groupRepository.softDelete(groupId);
    if (result.affected === 0) {
      throw new NotFoundException(`${groupId}로 작성된 게시글이 없습니다.`);
    }
  }

  //<<------------소모임 수정------------>>
  async updateGroup(
    groupId: string,
    updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    const group = await this.getGroupById(groupId);

    Object.assign(group, updateGroupDto);

    const updatedGroup = await this.groupRepository.save(group);

    return updatedGroup;
  }

  //<<------------소모임 구인 중 상태 변경------------>>
  async updateGroupStatus(groupId: string): Promise<Group> {
    const group = await this.getGroupById(groupId);

    if ((group.status = GroupStatus.PUBLIC)) {
      group.status = GroupStatus.PRIVATE;
    } else if ((group.status = GroupStatus.PRIVATE)) {
      group.status = GroupStatus.PUBLIC;
    } //구인중을 구인마감으로, 구인마감을 구인중으로 변경

    await this.groupRepository.save(group);
    return group;
  }

  //<<------------소모임 가입 신청------------>>
  async joinGroup(id: string, groupId: string): Promise<Member> {
    const user = await this.userRepository.findOne({ where: { id } });
    const group = await this.groupRepository.findOne({ where: { groupId } });

    const isMember = await this.memberRepository.findOne({
      where: {
        user: user,
      },
    });
    if (isMember) {throw new ConflictException("이미 가입한 그룹입니다.");} //prettier-ignore

    const newMember = new Member();
    newMember.user = user;
    newMember.group = group;
    newMember.status = MemberStatus.PENDING;

    return this.memberRepository.save(newMember);
  }

  //<<------------소모임 신청에 대한 수락------------>>
  async acceptMember(id: string, groupId: string): Promise<Member> {
    const request = await this.userRepository.findOne({ where: { id } });
    const group = await this.groupRepository.findOne({ where: { groupId } });

    if(!request) {throw new NotFoundException('찾을 수 없는 신청자 입니다.')} //prettier-ignore
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    const checkRequest = await this.memberRepository.findOne({
      where: {
        user: { id },
        group: { groupId },
        status: MemberStatus.PENDING,
      },
    });

    if(checkRequest.status = MemberStatus.CONFIRMED){throw new NotFoundException('이미 수락한 신청자 입니다.')} //prettier-ignore

    checkRequest.status = MemberStatus.CONFIRMED;

    return this.memberRepository.save(checkRequest);
  }

  //<<------------소모임 신청에 대한 거절(삭제)------------>>
  async denyMember(memberId: string, groupId: string): Promise<void> {
    const request = await this.memberRepository.findOne({ where : {memberId}}); //prettier-ignore
    const group = await this.groupRepository.find({ where: { groupId } });

    if(!request) {throw new NotFoundException('찾을 수 없는 신청자 입니다.')} //prettier-ignore
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    await this.memberRepository.softDelete(request.memberId);
  }

  //<<------------가입 대기중인 멤버 조회------------>>
  async getPendingMembers(groupId: string): Promise<Member[]> {
    const group = await this.groupRepository.findOne({ where: { groupId } });

    if (!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    const pendingMembers = await this.memberRepository.find({
      where: {
        status: MemberStatus.PENDING,
      },
    });

    return pendingMembers;
  }

  //<<------------가입된 멤버 조회------------>>
  async getConfirmedMembers(groupId: string): Promise<Member[]> {
    const group = await this.groupRepository.findOne({ where: { groupId } });

    if (!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    const confirmedMembers = await this.memberRepository.find({
      where: {
        status: MemberStatus.CONFIRMED,
      },
    });

    return confirmedMembers;
  }
}
