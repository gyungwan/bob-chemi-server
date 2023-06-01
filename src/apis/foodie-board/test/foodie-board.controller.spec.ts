import { Test, TestingModule } from "@nestjs/testing";
import { FoodieBoardController } from "../foodie-board.controller";
import { FoodieBoardService } from "../foodie-board.service";

describe("FoodieBoardController", () => {
  let controller: FoodieBoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodieBoardController],
      providers: [FoodieBoardService],
    }).compile();

    controller = module.get<FoodieBoardController>(FoodieBoardController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
