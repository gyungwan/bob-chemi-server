import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";
import { FileUploadService } from "./file-upload.service";
import multerS3 from "multer-s3";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

@Controller("fileUpload")
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post("upload")
  @ApiOperation({
    summary: "단일 파일 업로드",
    description: "단일 파일 업로드 API",
  })
  @ApiResponse({
    description: "이미지 url이 리턴됩니다",
  })
  @UseInterceptors(
    FileInterceptor("file", {
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
          const folderPath = "image/"; // 원하는 경로를 여기에 지정하세요
          const ext = path.extname(file.originalname); // 파일 확장자 추출
          const basename = path.basename(file.originalname, ext); // 파일 이름 추출
          // 파일 이름 중복을 방지하기 위해, 현재 시간을 추가하여 파일 이름을 고유하게 만듭니다
          done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
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
  uploadFile(@UploadedFile() file: Express.MulterS3.File) {
    return this.fileUploadService.uploadFile(file);
  }

  @Post("multipleUpload")
  @ApiOperation({
    summary: "Multiple file upload",
    description: "Multiple File Upload API",
  })
  @ApiResponse({
    description: "The image urls are returned",
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
          const folderPath = "images/"; // specify the desired path here
          const ext = path.extname(file.originalname); // extract file extension
          const basename = path.basename(file.originalname, ext); // extract file name
          // Make the filename unique by appending the current time to prevent filename duplication
          done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        files: {
          type: "array",
          items: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
  })
  uploadMultipleFiles(@UploadedFiles() files: Express.MulterS3.File[]) {
    const urls = files.map((file) => file.location);
    return urls;
  }
}
