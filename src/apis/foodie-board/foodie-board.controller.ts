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

  @Get()
  @ApiOperation({
    summary: "맛잘알 전체 조회 ",
    description: "맛잘알 전체 조회API",
  })
  async findAll() {
    return await this.foodieBoardService.findAll();
  }

  @Get(":id")
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

  @Patch(":id")
  @UseGuards(RestAuthAccessGuard)
  @UseInterceptors(FilesInterceptor)
  async update(
    @Param("id") imgId: string,
    @Body() updateFoodieBoardDto: UpdateFoodieBoardDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.MulterS3.File[] = []
  ) {
    const userId = (req as any).user?.id;

    return await this.foodieBoardService.update(
      imgId,
      updateFoodieBoardDto,
      userId,
      files
    );
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.foodieBoardService.remove(+id);
  }
}
