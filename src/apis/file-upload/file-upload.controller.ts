import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { FileUploadService } from "./file-upload.service";

@Controller("fileUpload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @ApiOperation({
    summary: "파일 업로드",
    description: "파일 업로드 API",
  })
  @ApiResponse({
    description: "이미지 url이 리턴됩니다",
  })
  @UseInterceptors(FilesInterceptor("files", 10))
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadFiles(@UploadedFiles() files) {
    const imgurl: string[] = [];
    await Promise.all(
      files.map(async (file: Express.MulterS3.File) => {
        const key = await this.fileUploadService.uploadFiles(file);
        imgurl.push(key);
      })
    );
    return imgurl;
  }
}
