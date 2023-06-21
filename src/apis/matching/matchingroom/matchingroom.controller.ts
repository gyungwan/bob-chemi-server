import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { MatchingRoomService } from "./matchingroom.service";

@ApiTags("매칭룸 API")
@Controller("matchingRoom")
export class MatchingRoomController {
  constructor(private readonly matchingRoomService: MatchingRoomService) {}

  //----------------- 매칭 성사-----------------------//

  //----------------- 유저가 매칭 거절 -----------------------//

  //----------------- 매칭 전 매칭 취소 -----------------------//

  //----------------- 매칭룸에서 제거(시간 제한)-----------------------//
}
