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

@Controller("groups")
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  //<<------------소모임 조회------------>>
  @Get("/")
  @ApiOperation({ description: "모든 소모임 조회" })
  getAllGroupBoard(): Promise<Group[]> {
    return this.groupsService.getAllGroups();
  }

  //<<------------ID로 게시글 조회------------>>
  @Get("/:id")
  @ApiOperation({ description: "id로 소모임 검색" })
  getBoardById(@Param("id") id: number): Promise<Group> {
    return this.groupsService.getGroupById(id);
  }

  //<<------------소모임 생성------------>>
  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({ description: "소모임 생성" })
  createGroupBoard(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.createGroup(createGroupDto);
  }

  //<<------------소모임 삭제------------>>
  @Delete()
  @ApiOperation({ description: "소모임 삭제" })
  deleteBoard(@Param("id", ParseIntPipe) id): Promise<void> {
    return this.groupsService.deleteGroupBoard(id);
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

  //<<------------소모임 상태 수정------------>>
  @Patch("/:id/status")
  @ApiOperation({ description: "소모임 모집중 <-> 모집완 변경" })
  updateGroupStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", GroupStatusValidationPipe) status: GroupStatus
  ) {
    return this.updateGroupStatus(id, status);
  }
}
