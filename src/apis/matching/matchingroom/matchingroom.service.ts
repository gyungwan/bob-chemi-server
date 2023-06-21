import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { QuickMatching } from "../quickmatchings/entities/quickmatchings.entity";
import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";

@Injectable()
export class MatchingRoomService {
  constructor(
    @Inject(forwardRef(() => QuickMatchingService))
    private quickMatchingService: QuickMatchingService
  ) {}
}
