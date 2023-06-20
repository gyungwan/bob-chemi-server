import { User } from "src/apis/users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from "typeorm";

@Entity()
export class RestaurantMark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.restaurantMarks)
  user: User;

  @Column()
  placeId: string;
}
