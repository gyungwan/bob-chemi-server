import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import multerS3 from "multer-s3";
import path from "path";

export const multerOptionsFactory = (
  ConfigService: ConfigService
): MulterOptions => {
  // s3 인스턴스 생성
  const s3 = new S3Client({
    region: ConfigService.get("AWS_BUCKET_REGION"),
    credentials: {
      accessKeyId: ConfigService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: ConfigService.get("AWS_SECRET_ACCESS_KEY"),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: ConfigService.get("AWS_BUCKET_NAME"),
      key(_req, file, done) {
        const folderPath = "image/foodieBoard"; //버킷에 원하는 폴더안에 저장
        const ext = path.extname(file.originalname); // 파일의 확장자 추출
        const basename = path.basename(file.originalname, ext); // 파일 이름
        // 파일 이름이 중복되는 것을 방지하기 위해 파일이름_날짜.확장자 형식으로 설정
        done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  };
};
