import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import multerS3 from "multer-s3";
import path from "path";

export const multerOptionsFactory = (
  configService: ConfigService
): MulterOptions => {
  // s3 인스턴스 생성
  const s3 = new S3Client({
    region: configService.get("AWS_BUCKET_REGION"),
    credentials: {
      accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
      secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
    },
  });

  return {
    storage: multerS3({
      s3,
      bucket: configService.get("AWS_BUCKET_NAME"),
      key(_req, file, done) {
        // const folderPath = req.body.folderName || "default"; // 폴더 경로가 제공되지 않은 경우 default 폴더에 저장
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
// export const multerOptionsFactoryForGroup = (
//   configService: ConfigService
// ): MulterOptions => {
//   const s3 = new S3Client({
//     region: configService.get("AWS_BUCKET_REGION"),
//     credentials: {
//       accessKeyId: configService.get("AWS_ACCESS_KEY_ID"),
//       secretAccessKey: configService.get("AWS_SECRET_ACCESS_KEY"),
//     },
//   });

//   return {
//     storage: multerS3({
//       s3,
//       bucket: configService.get("AWS_BUCKET_NAME"),
//       key(_req, file, done) {
//         const folderPath = "image/smallGroup";
//         const ext = path.extname(file.originalname);
//         const basename = path.basename(file.originalname, ext);
//         done(null, `${folderPath}/${basename}_${Date.now()}${ext}`);
//       },
//     }),
//     limits: { fileSize: 10 * 1024 * 1024 },
//   };
// };
