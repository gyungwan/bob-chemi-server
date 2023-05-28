import { CustomRepository } from "src/apis/group/boards/typeorm/typeorm-ex.decorator";
import { Repository } from "typeorm";
import { BoardStatus } from "./boards.status.enum";
import { CreateBoardDto } from "./dto/create.board.dto";
import { Board } from "./entity/boards.entity";

@CustomRepository(Board)
export class BoardRepository extends Repository<Board> {
  async createBoard(createBoardDTO: CreateBoardDto): Promise<Board> {
    const { title, description } = createBoardDTO;

    const board = this.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });
    await this.save(board);
    return board;
  }
}
