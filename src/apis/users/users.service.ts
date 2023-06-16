import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async create(createUserDto: CreateUserDto) {
    const email = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (email) {
      throw new ConflictException("이미 가입한 email입니다.");
    }

    const user = this.userRepository.create(createUserDto);
    user.password = createUserDto.password;
    await this.userRepository.save(user);
    return {
      status: {
        code: 200,
        message: "회원가입 성공!",
      },
    };
  }
  findAll() {
    return `This action returns all users`;
  }

  // findOne({ id }): Promise<User> {
  //   return this.userRepository.findOne({ where: { id } });
  // }

  async findOneEmail(email): Promise<User> {
    return await this.userRepository.findOne({ where: { id: email } });
  }

  async findOnePhone({ phone }: { phone: string }): Promise<string> {
    const user = await this.userRepository.findOneBy({ phone });
    return user.phone;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findOneChemiRating(id): Promise<number> {


    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    return user.chemiRating;
  }

  async updateChemiRating(id: string, newChemiRating: number) {
    //: Promise<User>
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("사용자를 찾을 수 없습니다.");
    }
    user.chemiRating = newChemiRating;
    return this.userRepository.save(user); // user
  }
}
