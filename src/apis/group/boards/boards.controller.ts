import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Board, BoardStatus } from "./boards.model";
import { BoardService } from "./boards.service";
import { CreateBoardDto } from "./dto/create.board.dto";
import { BoardStatusValidationPipe } from "./pipes/board.status.validation";

@Controller("boards")
export class BoardsController {
  constructor(private boardsService: BoardService) {}

  //<<------------게시글 조회------------>>
  @Get("/")
  getAllBoard(): Board[] {
    return this.boardsService.getAllBoards();
  }

  //<<------------ID로 게시글 조회------------>>
  @Get("/:id")
  getBoardById(@Param("id") id: string): Board {
    return this.boardsService.getBoardById(id);
  }

  //<<------------게시글 작성------------>>
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Board {
    return this.boardsService.createBoard(createBoardDto);
  }

  //<<------------게시글 삭제------------>>
  @Delete()
  deleteBoard(@Param("id") id: string): void {
    this.boardsService.deleteBoard(id);
  }

  //<<------------게시글 상태 수정------------>>
  @Patch("/:id/status")
  updateBoardStatus(
    @Param("id") id: string,
    @Body("status", BoardStatusValidationPipe) status: BoardStatus
  ) {
    return this.updateBoardStatus(id, status);
  }
}
