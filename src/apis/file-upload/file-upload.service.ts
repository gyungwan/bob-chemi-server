import { BadRequestException, Injectable } from "@nestjs/common";

@Injectable()
export class FileUploadService {
  async uploadFiles(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException("파일들이 존재하지 않습니다.");
    }
    return file.location;
  }
}
