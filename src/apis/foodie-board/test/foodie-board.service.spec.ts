import { Test, TestingModule } from '@nestjs/testing';
import { FoodieBoardService } from './foodie-board.service';

describe('FoodieBoardService', () => {
  let service: FoodieBoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodieBoardService],
    }).compile();

    service = module.get<FoodieBoardService>(FoodieBoardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
