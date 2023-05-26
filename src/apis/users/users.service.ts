import { ConflictException, Injectable } from "@nestjs/common";
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

    await this.userRepository.save(createUserDto);

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

  findOne(id: number) {
    return `This action returns a #${id} user`;
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
}
