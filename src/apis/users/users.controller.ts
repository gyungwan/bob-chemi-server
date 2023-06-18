import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
  Query,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import * as bcrypt from "bcrypt";
import { Request } from "express";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { User } from "./entities/user.entity";
import { UserProfileDto } from "./dto/userProfileDto";

@Controller("user")
@ApiTags("유저 API")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  //------------ 유저 회원가입 -----------
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
  //----------------- 유저의 특정데이터 조회 -----------------------//
  @Get("/profile")
  @ApiOperation({
    summary: "유저 특정데이터 조회 프로필",
    description: "유저 특정데이터 조회 프로필 API",
  })
  async getUserProfile(
    @Query("id") id: string
    //
  ): Promise<UserProfileDto> {
    const userProfile = await this.usersService.userProfile(id);
    if (!userProfile) {
      throw new NotFoundException("The user could not be found.");
    }
    return userProfile;
  }

  //----------------- 유저의 케미지수 조회 -----------------------//
  // @Get("/chemiRating")
  // @UseGuards(RestAuthAccessGuard)
  // @ApiOperation({ summary: "유저의 케미지수 조회" })
  // async fetchChemiRating(@Req() req: Request) {
  //   const userId = (req.user as any).id;
  //   //console.log(userId);

  //   return this.usersService.findOneChemiRating(userId);
  // }

  @Get(":id")
  @UseGuards(RestAuthAccessGuard)
  @ApiOperation({ summary: "유저의 케미지수 조회" })
  async fetchChemiRating(
    @Param("id") id: string,
    @Query("chemiRating") chemiRating: number
  ) {
    console.log(id, "==================");
    return this.usersService.findOneChemiRating(id);
  }
  //------------ 유저 정보 수정 ----------- //
  @Patch(":id")
  @ApiOperation({
    summary: "유저 수정",
    description: "유저 수정 API",
  })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    const updatedUser = await this.usersService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException("해당하는 유저를 찾을 수 없습니다.");
    }
    return updatedUser;
  }
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
