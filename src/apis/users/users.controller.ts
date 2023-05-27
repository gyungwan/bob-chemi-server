import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";

@Controller("user")
@ApiTags("유저 API")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: "유저 회원가입",
    description: "유저 회원가입 API",
  })
  @ApiResponse({
    description: "회원가입한 회원정보가 리턴됩니다",
    type: CreateUserDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const modifiedCreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };
    return await this.usersService.create(modifiedCreateUserDto);
  }

  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  // @Get(":id")
  // async findOne(@Param("id") id: string) {
  //   return await this.usersService.findOne(id);
  // }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(+id);
  }
}
