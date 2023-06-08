import { User } from "src/apis/users/entities/user.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "./groups.entity";

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userGroups)
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  group: Group;
}
