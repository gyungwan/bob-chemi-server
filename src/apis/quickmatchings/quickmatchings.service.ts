import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateQuickMatchingDto } from "./dto/create-quickmatching.dto";
import { QuickMatching } from "./entities/quickmatchings.entity";

@Injectable()
export class QuickMatchingService {
  constructor(
    @InjectRepository(QuickMatching)
    private readonly quickMatchingRepository: Repository<QuickMatching>
  ) {}

  async create(
    createQuickMatchingDto: CreateQuickMatchingDto
  ): Promise<QuickMatching> {
    const quickMatching = await this.quickMatchingRepository.create(
      createQuickMatchingDto
    );
    return this.quickMatchingRepository.save(quickMatching);
  }

  async findOne(id): Promise<QuickMatching> {
    const quickMatching = await this.quickMatchingRepository.findOne(id);
    return quickMatching;
  }
  async cancel(id) {
    const quickMatching = await this.quickMatchingRepository.findOne(id);
    if (!quickMatching) {
      throw new NotFoundException("매칭을 찾을 수 없습니다.");
    }
    await this.quickMatchingRepository.softDelete(id);
  }
}
