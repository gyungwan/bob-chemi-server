// image.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { FoodieBoard } from "./foodie-board.entity";

@Entity()
export class FoodieImage {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => FoodieBoard, (foodieBoard) => foodieBoard.images, {
    onDelete: "CASCADE",
  })
  foodieBoard: FoodieBoard;
}
