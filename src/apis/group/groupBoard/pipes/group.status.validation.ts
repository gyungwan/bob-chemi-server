import { BadRequestException, PipeTransform } from "@nestjs/common";
import { GroupStatus } from "../entites/groups.status.enum";

export class GroupStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [
    GroupStatus.PRIVATE,
    GroupStatus.PUBLIC, //
  ];

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not correct status`);
    }

    return value;
  }

  private isStatusValid(status: any) {
    const index = this.StatusOptions.indexOf(status);
    return index !== -1;
  }
}
