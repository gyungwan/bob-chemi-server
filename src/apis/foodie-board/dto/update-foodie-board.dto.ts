import { PartialType } from '@nestjs/swagger';
import { CreateFoodieBoardDto } from './create-foodie-board.dto';

export class UpdateFoodieBoardDto extends PartialType(CreateFoodieBoardDto) {}
