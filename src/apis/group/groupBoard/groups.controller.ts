import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateGroupDto } from "./dto/create.group.dto";
import { Group } from "./entites/groups.entity";
import { GroupsService } from "./groups.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UpdateGroupDto } from "./dto/update.group.dto";
import { Member } from "./entites/members.entity";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";

@Controller("groups")
@ApiTags("소모임 API")
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  //<<------------소모임 조회------------>>
  @Get("/")
  @ApiOperation({
    summary: "모든 소모임 조회",
    description: "모든 소모임 조회",
  })
  getAllGroupBoard(): Promise<Group[]> {
    return this.groupsService.getAllGroups();
  }

  //<<------------ID로 소모임 조회------------>>
  @Get("/:id")
  @ApiOperation({
    summary: "ID로 소모임 검색 ",
    description: "id로 소모임 검색",
  })
  getBoardById(@Param("groupId") groupId: number): Promise<Group> {
    return this.groupsService.getGroupById(groupId);
  }

  //<<------------날짜로 소모임 조회------------>>
  @Get("/date/:date")
  @ApiOperation({
    summary: "날짜로 소모임 검색",
    description: "해당 날짜의 모든 소모임 조회",
  })
  getGroupByDate(@Param("date") groupDate: Date): Promise<Group[]> {
    const date = new Date(groupDate);
    return this.groupsService.getGroupByDate(date);
  }

  //<<------------내가 만든 소모임 조회------------>>
  @Get("/created/:userId")
  @ApiOperation({
    summary: "내가 만든 소모임 조회",
    description: "사용자의 이메일을 통해, 사용자가 만든 모든 소모임 조회",
  })
  getGroupsCreatedByUser(@Param("userId") userId: string): Promise<Group[]> {
    return this.groupsService.getMyGroup(userId);
  }

  // <<------------내가 가입한 소모임 조회------------>>
  @Get("/joined/:userId")
  @ApiOperation({
    summary: "내가 가입한 소모임 조회",
    description: "사용자의 이메일을 통해, 사용자가 가입한 모든 소모임 조회",
  })
  getGroupsJoinedByUser(@Param("userId") userId: string): Promise<Group[]> {
    return this.groupsService.getMyConfirmedGroup(userId);
  }

  //<<------------소모임 생성------------>>
  @Post("/:userId")
  @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard("access"))
  @ApiOperation({ summary: "소모임 생성", description: "소모임 생성" })
  createGroupBoard(
    @Body() createGroupDto: CreateGroupDto,
    @Param("userId") userId: string,
    @UploadedFile() file: Express.MulterS3.File
  ): Promise<Group> {
    return this.groupsService.createGroup(createGroupDto, userId, file);
  }

  //<<------------소모임 삭제------------>>
  @Delete("/:id")
  @ApiOperation({ summary: "소모임 삭제", description: "소모임 삭제" })
  deleteBoard(@Param("id", ParseIntPipe) id): Promise<void> {
    return this.groupsService.deleteGroup(id);
  }

  //<<------------소모임 수정------------>>
  @Patch("/:id/group")
  @ApiOperation({
    summary: "소모임 게시글 수정",
    description: "해당 소모임 ID로 찾아와서, 수정된 내용 입력",
  })
  updateGroup(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateGroupDto: UpdateGroupDto
  ) {
    return this.groupsService.updateGroup(id, updateGroupDto);
  }

  //<<------------소모임 구인 중 상태 변경------------>>
  @Patch("/:id/status")
  @ApiOperation({
    summary: "구인 상태 변경",
    description:
      "실행할 때 마다, 해당 ID의 소모임 구인 상태가 구인중<->구인완료 변경",
  })
  updateGroupStatus(@Param("groupId") id: number) {
    return this.groupsService.updateGroupStatus(id);
  }

  //<<------------소모임 가입 신청------------>>
  @Post(":email/:groupId/join")
  @ApiOperation({
    summary: "소모임 가입 신청",
    description:
      "가입 신청 api 실행하면 member에 등록되어 가입 상태가 pending 처리 됨",
  })
  async joinGroup(
    @Param("email") email: string,
    @Param("groupId") groupId: number
  ): Promise<Member> {
    return this.groupsService.joinGroup(email, groupId);
  }

  //<<------------소모임 신청에 대한 수락------------>>
  @Post(":memberId/:groupId/accept")
  @ApiOperation({
    summary: "소모임 가입 수락",
    description: "Member의 가입 상태 pending을 confirmed로 변경",
  })
  async acceptMember(
    @Param("memberId") memberId: string,
    @Param("groupId") groupId: number
  ): Promise<Member> {
    return this.groupsService.acceptMember(memberId, groupId);
  }

  //<<------------소모임 신청에 대한 거절(삭제)------------>>
  @Delete(":memberId/:groupId/deny")
  @ApiOperation({
    summary: "소모입 가입 거절",
    description: "member의 소모입 가입 신청을 삭제함",
  })
  async denyMember(
    @Param("memberId") memberId: string,
    @Param("groupId") groupId: number
  ): Promise<void> {
    return this.groupsService.denyMember(memberId, groupId);
  }

  //<<------------가입 대기중인 멤버 조회------------>>
  @Get(":groupId/pending")
  @ApiOperation({
    summary: "가입 대기중인 멤버 조회",
    description: "소모임 가입 대기중인 멤버 조회",
  })
  async getPendingMembers(
    @Param("groupId") groupId: number
  ): Promise<Member[]> {
    return this.groupsService.getPendingMembers(groupId);
  }

  //<<------------가입된 멤버 조회------------>>
  @Get(":groupId/confirmed")
  @ApiOperation({
    summary: "가입 허가된 멤버 조회",
    description: "소모임에 가입된 멤버 조회",
  })
  async getConfirmedMembers(
    @Param("groupId") groupId: number
  ): Promise<Member[]> {
    return this.groupsService.getConfirmedMembers(groupId);
  }
}
