import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { QuickMatchingService } from "./quickmatchings.service";

@ApiTags("QUICKMATCHING API")
@Controller()
export class QuickMatchingController {
  constructor(private readonly quickMatchingService: QuickMatchingService) {}
}
