import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileUploadService } from "../file-upload/file-upload.service";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { FoodieBoard } from "./entities/foodie-board.entity";
import { FoodieImage } from "./entities/foodieBoard-image.entity";

@Injectable()
export class FoodieBoardService {
  constructor(
    @InjectRepository(FoodieBoard)
    private readonly foodieBoardRepository: Repository<FoodieBoard>,
    @InjectRepository(FoodieImage)
    private readonly imageRepository: Repository<FoodieImage>,
    private readonly fileUploadService: FileUploadService
  ) {}
  async create(
    createFoodieBoardDto: CreateFoodieBoardDto,
    userId,
    files: Express.MulterS3.File[]
  ) {
    const images =
      files && files.length > 0
        ? await Promise.all(
            files.map(async (file) => {
              const url = await this.fileUploadService.uploadFiles(file);
              return this.imageRepository.create({ url });
            })
          )
        : [];

    const foodieBoard = await this.foodieBoardRepository.save({
      ...createFoodieBoardDto,
      user: { id: userId },
      images,
    });

    return foodieBoard;
  }

  async findAll() {
    return await this.foodieBoardRepository.find();
  }

  async findOne(id: string) {
    return await this.foodieBoardRepository.findOneBy({ id });
  }
  async update(
    id: string, //
    updateFoodieBoardDto: UpdateFoodieBoardDto,
    userId: string,
    files: Express.MulterS3.File[]
  ) {
    const existingFoodieBoard = await this.foodieBoardRepository.findOne({
      where: { id },
      relations: ["user"],
    });

    if (!existingFoodieBoard) {
      throw new BadRequestException("해당 게시글이 존재하지 않습니다.");
    }

    if (existingFoodieBoard.user.id !== userId) {
      throw new BadRequestException("게시글을 수정할 권한이 없습니다.");
    }

    if (files.length > 0) {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const url = await this.fileUploadService.uploadFiles(file);
          return this.imageRepository.create({ url });
        })
      );

      // 기존 이미지들 삭제
      await Promise.all(
        existingFoodieBoard.images.map(async (image) => {
          await this.fileUploadService.deleteFile(image.url);
          await this.imageRepository.remove(image);
        })
      );

      // 새로운 이미지들 추가
      existingFoodieBoard.images = newImages;
    }

    if (updateFoodieBoardDto.title !== undefined) {
      existingFoodieBoard.title = updateFoodieBoardDto.title;
    }
    if (updateFoodieBoardDto.content !== undefined) {
      existingFoodieBoard.content = updateFoodieBoardDto.content;
    }

    return await this.foodieBoardRepository.save(existingFoodieBoard);
  }

  remove(id: number) {
    return `This action removes a #${id} foodieBoard`;
  }
}
