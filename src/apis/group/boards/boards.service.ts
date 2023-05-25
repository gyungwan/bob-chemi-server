import { Injectable, NotFoundException } from "@nestjs/common";
import { Board, BoardStatus } from "./boards.model";
import { v1 as uuid } from "uuid";
import { CreateBoardDto } from "./dto/create.board.dto";

@Injectable()
export class BoardService {
  private boards: Board[] = [];

  //<<------------게시글 조회------------>>
  getAllBoards(): Board[] {
    return this.boards;
  }

  //<<------------ID로 게시글 조회------------>>
  getBoardById(id: string): Board {
    const found = this.boards.find((board) => board.id === id);
    if (!found) throw new NotFoundException(`Cannot find Board with id: ${id}`);
    return found;
  }

  //<<------------게시글 작성------------>>
  createBoard(createBoardDto: CreateBoardDto) {
    const { title, description } = createBoardDto;

    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };
    this.boards.push(board);
    return board;
  }

  //<<------------게시글 삭제------------>>
  deleteBoard(id: string): void {
    const found = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== found.id);
  }

  //<<------------게시글 상태 수정------------>>
  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }
}
