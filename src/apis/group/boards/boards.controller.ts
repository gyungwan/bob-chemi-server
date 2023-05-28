import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { BoardStatus } from "./boards.status.enum";
import { BoardService } from "./boards.service";
import { CreateBoardDto } from "./dto/create.board.dto";
import { BoardStatusValidationPipe } from "./pipes/board.status.validation";
import { Board } from "./entity/boards.entity";

@Controller("boards")
export class BoardsController {
  constructor(private boardsService: BoardService) {}

  //<<------------게시글 조회------------>>
  @Get("/")
  getAllBoard(): Promise<Board[]> {
    return this.boardsService.getAllBoards();
  }

  //<<------------ID로 게시글 조회------------>>
  @Get("/:id")
  getBoardById(@Param("id") id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }

  //<<------------게시글 작성------------>>
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }

  //<<------------게시글 삭제------------>>
  @Delete()
  deleteBoard(@Param("id", ParseIntPipe) id): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }

  //<<------------게시글 상태 수정------------>>
  @Patch("/:id/status")
  updateBoardStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", BoardStatusValidationPipe) status: BoardStatus
  ) {
    return this.updateBoardStatus(id, status);
  }
}
