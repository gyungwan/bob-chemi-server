import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { RestaurantMark } from "./entities/restaurantMark.entity";

@Injectable()
export class RestaurantMarkService {
  constructor(
    @InjectRepository(RestaurantMark)
    private readonly restaurantMarkRepository: Repository<RestaurantMark>
  ) {}

  async create(user: User, placeId: string) {
    const mark = this.restaurantMarkRepository.create({ user, placeId });
    return await this.restaurantMarkRepository.save(mark);
  }

  async findMark(user: User): Promise<RestaurantMark[]> {
    const userMark = await this.restaurantMarkRepository.find({
      where: { user: { id: user.id } },
      //user객체 안에 id값을 비교해서
    });

    console.log("=========", userMark);
    return userMark;
  }

  async remove(id: string): Promise<void> {
    await this.restaurantMarkRepository.delete(id);
  }

  async toggleMark(user: User, placeId: string): Promise<void> {
    const existingMark = await this.restaurantMarkRepository.findOne({
      where: {
        placeId: placeId,
        id: user.id,
      },
    });

    console.log(existingMark);

    if (existingMark) {
      await this.restaurantMarkRepository.delete({ id: existingMark.id });
    } else {
      const newMark = new RestaurantMark();
      newMark.user = user;
      newMark.placeId = placeId;
      await this.restaurantMarkRepository.save(newMark);
    }
  }
}
