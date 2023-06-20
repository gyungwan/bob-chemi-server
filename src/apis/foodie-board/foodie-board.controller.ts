import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FoodieBoardService } from "./foodie-board.service";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { Request } from "express";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { FilesInterceptor } from "@nestjs/platform-express";
import { User } from "../users/entities/user.entity";

@Controller("foodieBoard")
@ApiTags("맛잘알 API")
export class FoodieBoardController {
  constructor(private readonly foodieBoardService: FoodieBoardService) {}

  //<<------------맛잘알 게시글 생성------------>>
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @UseInterceptors(FilesInterceptor)
  @ApiOperation({
    summary: "맛잘알 생성",
    description: "맛잘알 생성 API",
  })
  async create(
    @Body() createFoodieBoardDto: CreateFoodieBoardDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.MulterS3.File[] = []
  ) {
    const { title, content } = createFoodieBoardDto;
    const userId = (req.user as User).id;

    if (!title && !content) {
      throw new BadRequestException("제목과 내용은 필수 입력 항목입니다.");
    }

    return await this.foodieBoardService.create(
      createFoodieBoardDto,
      userId,
      files
    );
  }

  //----------이거 유저별로 조회로 바꾸기!!!!
  //<<------------맛잘알 게시글 단일 조회------------>>
  @Get("board/:id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 단일 조회 ",
    description: "맛잘알 단일 조회API",
  })
  async findOne(
    @Req() req: Request, //
    @Param("id") id: string
  ) {
    const userId = (req.user as User).id;
    console.log(userId);
    return await this.foodieBoardService.findOne(id);
  }
  //<<------------맛잘알 게시글 전체 조회------------>>
  @Get()
  @ApiOperation({
    summary: "맛잘알 전체 조회 ",
    description: "맛잘알 전체 조회API",
  })
  async findAll() {
    return await this.foodieBoardService.findAll();
  }

  //<<------------맛잘알 게시글 수정------------>>
  @Patch(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 수정 ",
    description: "맛잘알 수정 API",
  })
  @UseInterceptors(FilesInterceptor)
  async update(
    @Param("id") boardId: string,
    @Body() updateFoodieBoardDto: UpdateFoodieBoardDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.MulterS3.File[] = []
  ) {
    const userId = (req as any).user?.id;

    return await this.foodieBoardService.update(
      boardId,
      updateFoodieBoardDto,
      userId,
      files
    );
  }

  //<<------------맛잘알 게시글 삭제------------>>
  @Delete(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 삭제 ",
    description: "맛잘알 삭제 API",
  })
  async remove(@Param("id") boardId: string, @Req() req: Request) {
    const userId = (req.user as User).id;
    return await this.foodieBoardService.remove(boardId, userId);
  }
}
