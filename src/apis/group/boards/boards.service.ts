import { Injectable, NotFoundException } from "@nestjs/common";
import { BoardStatus } from "./boards.status.enum";
import { v1 as uuid } from "uuid";
import { CreateBoardDto } from "./dto/create.board.dto";
import { BoardRepository } from "./board.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entity/boards.entity";

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository
  ) {}
  //<<------------게시글 조회------------>>
  async getAllBoards(): Promise<Board[]> {
    return this.boardRepository.find();
  }
  //<<------------ID로 게시글 조회------------>>
  async getBoardById(id: any): Promise<Board> {
    const found = await this.boardRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Cannot find Board with ID ${id}`);
    }
    return found;
  }
  //<<------------게시글 작성------------>>
  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }
  //<<------------게시글 삭제------------>>
  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cannot find Board with id ${id}`);
    }
  }
  //<<------------게시글 수정------------>>
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}
