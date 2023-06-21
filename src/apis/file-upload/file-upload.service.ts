import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class FileUploadService {
  private readonly s3: S3Client;
  private readonly folderPath: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: configService.get<string>("AWS_BUCKET_REGION"),
      credentials: {
        accessKeyId: configService.get<string>("AWS_ACCESS_KEY_ID"),
        secretAccessKey: configService.get<string>("AWS_SECRET_ACCESS_KEY"),
      },
    });
    this.folderPath = "image/foodieBoard";
  }

  //<<------------단일 파일 업로드------------>>
  uploadFile(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException("파일이 존재하지 않습니다.");
    }

    return { filePath: file.location };
  }

  //<<------------여러 파일 업로드------------>>
  async uploadFiles(files: Express.MulterS3.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException("파일들이 존재하지 않습니다.");
    }
    const urls = files.map((file) => file.location);
    return urls;
  }

  //<<------------파일들 삭제------------>>
  async deleteFiles(fileUrls: string[]) {
    const bucket = this.configService.get<string>("AWS_BUCKET_NAME");

    // 여러 파일들을 동시에 삭제하기 위해 Promise.all을 사용합니다.
    await Promise.all(
      fileUrls.map(async (fileUrl) => {
        const key = `${this.folderPath}/${fileUrl.substring(
          fileUrl.lastIndexOf("/") + 1
        )}`;

        const params = {
          Bucket: bucket,
          Key: key,
        };

        try {
          await this.s3.send(new DeleteObjectCommand(params));
        } catch (error) {
          console.error("Failed to delete file from S3:", error);
          throw new BadRequestException("Failed to delete the file");
        }
      })
    );
  }
}
