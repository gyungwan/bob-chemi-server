import { Inject, Injectable } from "@nestjs/common";
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
    files: Express.MulterS3.File[]
  ) {
    const foodieBoard = await this.foodieBoardRepository.create({
      ...createFoodieBoardDto,
      user: { id: createFoodieBoardDto.userId },
    });

    const savedFoodieBoard = await this.foodieBoardRepository.save(foodieBoard);

    for (let file of files) {
      const url = await this.fileUploadService.uploadFiles(file);

      const image = this.imageRepository.create({
        url,
        foodieBoard: savedFoodieBoard,
      });
      await this.imageRepository.save(image);
    }

    return savedFoodieBoard;
  }

  async findAll() {
    return await this.foodieBoardRepository.find();
  }

  async findOne(id: string) {
    return await this.foodieBoardRepository.findOneBy({ id });
  }
  update(id: string, updateFoodieBoardDto: UpdateFoodieBoardDto) {
    return `This action updates a #${id} foodieBoard`;
  }

  remove(id: number) {
    return `This action removes a #${id} foodieBoard`;
  }
}
