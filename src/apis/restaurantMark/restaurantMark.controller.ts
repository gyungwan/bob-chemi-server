import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { User } from "../users/entities/user.entity";
import { RestaurantMarkService } from "./restaurantMark.service";

@ApiTags("음식점 즐겨찾기 API")
@Controller("mark")
export class RestaurantMarkController {
  constructor(private readonly restaurantMarkService: RestaurantMarkService) {}

  @Post()
  @ApiOperation({
    summary: "즐겨찾기 추가",
  })
  @UseGuards(RestAuthAccessGuard)
  async create(@Body("placeId") placeId: string, @Req() req: Request) {
    const user = req.user as User;
    console.log(user);
    return await this.restaurantMarkService.create(user, placeId);
  }
  @Post("toggleMark")
  @ApiOperation({
    summary: "즐겨찾기 추가,삭제 한번에",
  })
  @UseGuards(RestAuthAccessGuard)
  async toggleBookmark(
    @Req() req: Request, //
    @Body("placeId") placeId: string
  ) {
    const user = req.user as User;
    if (!placeId) {
      throw new BadRequestException("Place ID must not be null or undefined");
    }
    return await this.restaurantMarkService.toggleMark(user, placeId);
  }

  @Get()
  @ApiOperation({
    summary: "유저 즐겨찾기 조회",
  })
  @UseGuards(RestAuthAccessGuard)
  async findMark(@Req() req: Request) {
    const user = req.user as User;
    console.log(user);
    return await this.restaurantMarkService.findMark(user);
  }

  @Delete(":id")
  @ApiOperation({
    summary: "즐겨찾기 삭제",
  })
  @UseGuards(RestAuthAccessGuard)
  async remove(@Param("id") id: string) {
    return this.restaurantMarkService.remove(id);
  }
}
