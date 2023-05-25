import { EntityRepository, Repository } from "typeorm";
import { Board } from "./entity/boards.entity";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {}
