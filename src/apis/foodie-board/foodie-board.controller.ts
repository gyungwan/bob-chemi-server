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
  Query,
} from "@nestjs/common";
import * as multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import path from "path";
import { FoodieBoardService } from "./foodie-board.service";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { Request } from "express";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { FilesInterceptor } from "@nestjs/platform-express";
import { User } from "../users/entities/user.entity";
import { FileUploadService } from "../file-upload/file-upload.service";

@Controller("foodieBoard")
@ApiTags("맛잘알 API")
export class FoodieBoardController {
  constructor(
    private readonly foodieBoardService: FoodieBoardService, //
    private readonly fileUploadService: FileUploadService
  ) {}

  //<<------------맛잘알 게시글 생성------------>>
  @Post()
  @UseGuards(RestAuthAccessGuard)
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: multerS3({
        s3: new S3Client({
          region: process.env.AWS_BUCKET_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }),
        bucket: process.env.AWS_BUCKET_NAME,
        key(_req, file, done) {
          const folderPath = "image/foodieBoard/"; // specify the desired path here
          const ext = path.extname(file.originalname); // extract file extension
          const basename = path.basename(file.originalname, ext); // extract file name
          // Make the filename unique by appending the current time to prevent filename duplication
          done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
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
    console.log(files, "========");
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
  @Get("user")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 단일 조회 ",
    description: "맛잘알 게시글 유저별 조회API",
  })
  async findUser(
    @Req() req: Request, //
    @Param("id") id: string
  ) {
    const userId = (req.user as User).id;
    console.log("==============", userId);
    return await this.foodieBoardService.findOne(userId);
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

  //<<------------맛잘알 게시글 상세조회------------>>
  @Get("detail")
  @ApiOperation({
    summary: "맛잘알 게시글 상세 조회",
    description: "게시글 id를 통해 게시글 상세 조회",
  })
  async findDetail(@Query("id") id: string) {
    return await this.foodieBoardService.findDetail(id);
  }

  //<<------------맛잘알 게시글 수정------------>>
  @Patch(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({
    summary: "맛잘알 수정 ",
    description: "맛잘알 수정 API",
  })
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: multerS3({
        s3: new S3Client({
          region: process.env.AWS_BUCKET_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        }),
        bucket: process.env.AWS_BUCKET_NAME,
        key(_req, file, done) {
          const folderPath = "image/foodieBoard/"; // specify the desired path here
          const ext = path.extname(file.originalname); // extract file extension
          const basename = path.basename(file.originalname, ext); // extract file name
          // Make the filename unique by appending the current time to prevent filename duplication
          done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
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
