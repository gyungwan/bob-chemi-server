import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Group } from "./entites/groups.entity";
import { GroupsService } from "./groups.service";
import { GroupStatus } from "./entites/groups.status.enum";
import { GroupStatusValidationPipe } from "./pipes/group.status.validation";
import { ApiOperation } from "@nestjs/swagger";
import { UpdateGroupDto } from "./dto/update.group.dto";
import { Member } from "./entites/members.entity";

@Controller("groups")
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  //<<------------소모임 조회------------>>
  @Get("/")
  @ApiOperation({ description: "모든 소모임 조회" })
  getAllGroupBoard(): Promise<Group[]> {
    return this.groupsService.getAllGroups();
  }

  //<<------------ID로 소모임 조회------------>>
  @Get("/:id")
  @ApiOperation({ description: "id로 소모임 검색" })
  getBoardById(@Param("id") groupId: string): Promise<Group> {
    return this.groupsService.getGroupById(groupId);
  }

  //<<------------소모임 생성------------>>
  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: "소모임 생성" })
  createGroupBoard(
    @Body() createGroupDto: CreateGroupDto,
    @Param("id") id: string
  ): Promise<Group> {
    return this.groupsService.createGroup(createGroupDto, id);
  }

  //<<------------소모임 삭제------------>>
  @Delete()
  @ApiOperation({ description: "소모임 삭제" })
  deleteBoard(@Param("id", ParseIntPipe) id): Promise<void> {
    return this.groupsService.deleteGroup(id);
  }

  //<<------------소모임 수정------------>>
  @Patch("/:id/group")
  @ApiOperation({ description: "소모임 게시글 수정" })
  updateGroup(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto
  ) {
    return this.updateGroup(id, updateGroupDto);
  }

  //<<------------소모임 구인 중 상태 변경------------>>
  @Patch("/:id/status")
  @ApiOperation({ description: "소모임 모집중 <-> 모집완 변경" })
  updateGroupStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", GroupStatusValidationPipe) status: GroupStatus
  ) {
    return this.updateGroupStatus(id, status);
  }

  //<<------------소모임 가입 신청------------>>
  @Post(":id/:groupId/join")
  @ApiOperation({ description: "소모임 가입 신청" })
  async joinGroup(
    @Param("id") id: string,
    @Param("groupId") groupId: string
  ): Promise<Member> {
    return this.groupsService.joinGroup(id, groupId);
  }

  //<<------------소모임 신청에 대한 수락------------>>
  @Post(":id/:groupId/accept")
  @ApiOperation({ description: "소모임 가입 수락" })
  async acceptMember(
    @Param("id") id: string,
    @Param("groupId") groupId: string
  ): Promise<Member> {
    return this.groupsService.acceptMember(id, groupId);
  }

  //<<------------소모임 신청에 대한 거절(삭제)------------>>
  @Delete(":memberId/:groupId/deny")
  @ApiOperation({ description: "소모임 가입 거절" })
  async denyMember(
    @Param("memberId") memberId: string,
    @Param("groupId") groupId: string
  ): Promise<void> {
    return this.groupsService.denyMember(memberId, groupId);
  }

  //<<------------가입 대기중인 멤버 조회------------>>
  @Get(":groupId/pending")
  @ApiOperation({ description: "소모임 가입 대기중인 멤버 조회" })
  async getPendingMembers(
    @Param("groupId") groupId: string
  ): Promise<Member[]> {
    return this.groupsService.getPendingMembers(groupId);
  }

  //<<------------가입된 멤버 조회------------>>
  @Get(":groupId/confirmed")
  @ApiOperation({ description: "소모임에 가입된 멤버 조회" })
  async getConfirmedMembers(
    @Param("groupId") groupId: string
  ): Promise<Member[]> {
    return this.groupsService.getConfirmedMembers(groupId);
  }
}
