import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";
import { UsersService } from "src/apis/users/users.service";
import { RestAuthAccessGuard } from "src/common/auth/rest-auth-guards";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { CreateCheckInfoDto } from "./dto/create-checkInfo.dto";
import { MatchingRoom } from "./entities/matchingroom.entity";
import { MatchingRoomService } from "./matchingroom.service";

//@ApiTags("매칭룸 API")
@Controller("matchingRoom")
export class MatchingRoomController {
  constructor(
    private readonly matchingRoomService: MatchingRoomService,
    private readonly usersService: UsersService
  ) {}
}
