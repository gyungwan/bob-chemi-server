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
  ExecutionContext,
  UploadedFiles,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { FoodieBoardService } from "./foodie-board.service";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { Request } from "express";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";

@Controller("foodieBoard")
@ApiTags("맛잘알 API")
export class FoodieBoardController {
  constructor(private readonly foodieBoardService: FoodieBoardService) {}

  @Post()
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 생성",
    description: "맛잘알 생성 API",
  })
  async create(
    @Body() createFoodieBoardDto: CreateFoodieBoardDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.MulterS3.File[]
  ) {
    console.log(createFoodieBoardDto);

    // const foodieDto = JSON.parse(createFoodieBoardDto);
    console.log(createFoodieBoardDto);

    const { title, content } = createFoodieBoardDto;
    const userId = (req as any).user?.id;

    if (!title && !content) {
      throw new BadRequestException("제목과 내용은 필수 입력 항목입니다.");
    }

    return await this.foodieBoardService.create(
      createFoodieBoardDto,
      userId,
      files
    );
  }

  // @Post()
  // @ApiOperation({
  //   summary: "맛잘알 생성",
  //   description: "맛잘알 생성 API",
  // })
  // async create(
  //   @Req() req: Request,
  //   @UploadedFiles() files: Express.MulterS3.File[]
  // ) {
  //   const { title, content } = req.body; // Access form data directly from req.body
  //   const userId = (req as any).user?.id;

  //   console.log(title, content);

  //   if (!title && !content) {
  //     throw new BadRequestException(
  //       "The subject and content are required fields."
  //     );
  //   }

  //   const createFoodieBoardDto: CreateFoodieBoardDto = {
  //     title,
  //     content,
  //     userId,
  //   };

  //   return await this.foodieBoardService.create(createFoodieBoardDto, files);
  // }
  @Get()
  async findAll() {
    return await this.foodieBoardService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.foodieBoardService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateFoodieBoardDto: UpdateFoodieBoardDto
  ) {
    return this.foodieBoardService.update(id, updateFoodieBoardDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.foodieBoardService.remove(+id);
  }
}
