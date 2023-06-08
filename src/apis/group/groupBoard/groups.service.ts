import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GroupStatus } from "./entites/groups.status.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Group } from "./entites/groups.entity";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Equal, FindOneOptions, Repository } from "typeorm";
import { UpdateGroupDto } from "./dto/update.group.dto";
import { Member } from "./entites/members.entity";
import { MemberStatus } from "./entites/members.status.enum";
import { UsersService } from "src/apis/users/users.service";
import { group } from "console";
import { NotFound } from "@aws-sdk/client-s3";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userServices: UsersService,

    @InjectRepository(Member) // MemberRepository 주입
    private memberRepository: Repository<Member>
  ) {}

  //<<------------소모임 조회------------>>
  async getAllGroups(): Promise<Group[]> {
    return this.groupRepository.find();
  }

  //<<------------ID로 소모임 조회------------>>
  async getGroupById(groupId: any): Promise<Group> {
    const found = await this.groupRepository.findOne({ where: groupId });

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
    const user = await this.userServices.findOneEmail({ email: id });

    console.log(group, user, "group과 user console.log");

    const owner = new Member(); // 게시글 작성자 자동 멤버 가입
    owner.group = newGroup;
    owner.user = user;
    owner.status = MemberStatus.CONFIRMED;

    console.log(this.memberRepository, "memberRepository 조회");
    console.log(this.groupRepository, "groupRepository 조회");

    try {
      await this.memberRepository.save(owner);
    } catch (error) {
      console.log(error, "Save 에러 발생 시,");
    }

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
    groupId: number,
    updateGroupDto: UpdateGroupDto
  ): Promise<Group> {
    const group = await this.getGroupById(groupId);

    Object.assign(group, updateGroupDto);
    const updatedGroup = await this.groupRepository.save(group);
    return updatedGroup;
  }

  //<<------------소모임 구인 중 상태 변경------------>>
  async updateGroupStatus(groupId: number): Promise<Group> {
    const group = await this.getGroupById(groupId);

    if (group.status === GroupStatus.PUBLIC) {
      group.status = GroupStatus.PRIVATE;
    } else if (group.status === GroupStatus.PRIVATE) {
      group.status = GroupStatus.PUBLIC;
    }

    await this.groupRepository.save(group);
    return group;
  }

  //<<------------소모임 가입 신청------------>>
  async joinGroup(email: string, groupId: any): Promise<Member> {
    const user = await this.userServices.findOneEmail({ email });
    const group = await this.groupRepository.findOne({ where: { groupId } });

    const isPending = await this.memberRepository.findOne({
      where: {
        user: Equal(user.id),
        status: MemberStatus.PENDING,
      },
    });

    const isConfirmed = await this.memberRepository.findOne({
      where: {
        user: Equal(user.id),
        status: MemberStatus.CONFIRMED,
      },
    });

    if (isPending) {throw new ConflictException("이미 가입신청 되었습니다.");} //prettier-ignore
    if (isConfirmed) {throw new ConflictException("이미 가입된 그룹입니다.");} //prettier-ignore

    const newMember = new Member();
    newMember.user = user;
    newMember.group = group;
    newMember.status = MemberStatus.PENDING;

    return this.memberRepository.save(newMember);
  }

  //<<------------소모임 신청에 대한 수락------------>>
  async acceptMember(memberId: string, groupId: any): Promise<Member> {
    const group = await this.groupRepository.findOne({ where: { groupId } });
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    const checkRequest = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
        status: MemberStatus.PENDING,
      },
    });

    if (!checkRequest) {
      throw new NotFoundException("가입 신청이 없는 멤버입니다.");
    }
    if (checkRequest.status === MemberStatus.CONFIRMED) {
      throw new NotFoundException("이미 수락한 신청자 입니다.");
    }

    checkRequest.status = MemberStatus.CONFIRMED;
    return this.memberRepository.save(checkRequest);
  }

  //<<------------소모임 신청에 대한 거절(삭제)------------>>
  async denyMember(memberId: any, groupId: number): Promise<void> {
    const request = await this.memberRepository.findOne(memberId); //prettier-ignore
    const group = await this.groupRepository.findOne({ where: { groupId } });

    if(!request) {throw new NotFoundException('찾을 수 없는 신청자 입니다.')} //prettier-ignore
    if(!group) {throw new NotFoundException('찾을 수 없는 소모임 입니다.')} //prettier-ignore

    await this.memberRepository.softDelete(request.memberId);
  }

  //<<------------가입 대기중인 멤버 조회------------>>
  async getPendingMembers(groupId: any): Promise<Member[]> {
    const group: FindOneOptions<Group> = { where: { groupId: groupId } };

    const foundGroup = await this.groupRepository.findOne(group);

    if (!foundGroup) {
      throw new NotFoundException("찾을 수 없는 소모임입니다.");
    }

    const pendingMembers = await this.memberRepository.find({
      where: {
        group: { groupId: foundGroup.groupId },
        status: MemberStatus.PENDING,
      },
    });

    if (pendingMembers.length === 0) {
      throw new NotFoundException("가입 대기 중인 멤버가 없습니다.");
    }

    return pendingMembers;
  }

  //<<------------가입된 멤버 조회------------>>
  async getConfirmedMembers(groupId: number): Promise<Member[]> {
    const group: FindOneOptions<Group> = { where: { groupId: groupId } };
    const foundGroup = await this.groupRepository.findOne(group);

    if (!foundGroup) {
      throw new NotFoundException("찾을 수 없는 소모임입니다.");
    }

    const confirmedMembers = await this.memberRepository.find({
      where: {
        group: { groupId: foundGroup.groupId },
        status: MemberStatus.CONFIRMED,
      },
    });

    if (confirmedMembers.length === 0) {
      throw new NotFoundException("가입한 멤버가 없습니다.");
    }

    return confirmedMembers;
  }
}
