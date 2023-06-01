import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateFoodieBoardDto } from "./dto/create-foodie-board.dto";
import { UpdateFoodieBoardDto } from "./dto/update-foodie-board.dto";
import { FoodieBoard } from "./entities/foodie-board.entity";

@Injectable()
export class FoodieBoardService {
  constructor(
    @InjectRepository(FoodieBoard)
    private readonly foodieBoardRepository: Repository<FoodieBoard>
  ) {}
  async create(createFoodieBoardDto: CreateFoodieBoardDto) {
    return await this.foodieBoardRepository.save(createFoodieBoardDto);
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
