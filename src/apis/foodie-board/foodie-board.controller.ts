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
} from "@nestjs/common";
import { FoodieBoardService } from "./foodie-board.service";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { Request } from "express";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

@Controller("foodieBoard")
export class FoodieBoardController {
  constructor(private readonly foodieBoardService: FoodieBoardService) {}

  @Post()
  async create(
    @Body() createFoodieBoardDto: CreateFoodieBoardDto,
    @Req() req: Request,
    @UploadedFiles() files: Express.MulterS3.File[]
  ) {
    const { title, content } = createFoodieBoardDto;
    const userId = (req as any).user?.id;
    console.log(title, content);
    try {
      if (!title && !content) {
        throw new BadRequestException("제목과 내용은 필수 입력 항목입니다.");
      }
      createFoodieBoardDto.userId = userId;
      return await this.foodieBoardService.create(createFoodieBoardDto, files);
    } catch (err) {
      return err;
    }
  }

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
