import { Test } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ChatRoom } from "../groupChat/entities/chatRooms.entity"; // 경로 수정
import { GroupChatService } from "../groupChat/groupChats.service"; // 경로 수정
import { Group } from "../groupBoard/entites/groups.entity"; // 경로 수정
import { GroupStatus } from "../groupBoard/entites/groups.status.enum"; // 경로 수정
import { Member } from "../groupBoard/entites/members.entity"; // 경로 수정
import { GroupsService } from "../groupBoard/groups.service"; // 경로 수정
import { FileUploadService } from "../../file-upload/file-upload.service"; // 경로 수정
import { UsersService } from "src/apis/users/users.service";

describe("GroupsService", () => {
  //의존성 주입
  let groupsService: GroupsService;
  let groupRepository: Repository<Group>;
  let usersService: UsersService;
  let memberRepository: Repository<Member>;
  let fileUploadService: FileUploadService;
  let chatRoomRepository: Repository<ChatRoom>;
  let groupChatService: GroupChatService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      //createTestingModule, 테스트할 모듈을 만들고 이하 서비스의 의존성을 주입
      providers: [
        GroupsService,
        {
          provide: Repository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
            softDelete: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOneId: jest.fn(),
            findOneEmail: jest.fn(),
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: Repository,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: GroupChatService,
          useValue: {
            createRoom: jest.fn(),
          },
        },
      ],
    }).compile();

    groupsService = moduleRef.get<GroupsService>(GroupsService);
    groupRepository = moduleRef.get<Repository<Group>>(Repository);
    usersService = moduleRef.get<UsersService>(UsersService);
    fileUploadService = moduleRef.get<FileUploadService>(FileUploadService);
    chatRoomRepository = moduleRef.get<Repository<ChatRoom>>(Repository);
    groupChatService = moduleRef.get<GroupChatService>(GroupChatService);
    //moduleRef, 테스트 모듈에서 필요한 부분을 가져옴
  });

  describe("getAllGroups", () => {
    it("모든 소모임 조회", async () => {
      const expectedResult: Group[] = [
        {
          groupId: 1,
          title: "제목",
          description: "모임",
          groupDate: new Date("2023-07-01"),
          groupHour: "12",
          groupMin: "30",
          groupLocation: "우리집",
          groupPeopleLimit: "10",
          status: GroupStatus.PRIVATE,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          members: [],
          users: [],
          image: null,
          owner: null,
          //이하 baseEntity에서 상속받음
          hasId: () => true,
          save: () => Promise.resolve(this),
          remove: () => Promise.resolve(this),
          softRemove: () => Promise.resolve(this),
          recover: () => Promise.resolve(this),
          reload: () => Promise.resolve(this),
        },
        {
          groupId: 2,
          title: "제목",
          description: "모임",
          groupDate: new Date("2023-07-10"),
          groupHour: "20",
          groupMin: "59",
          groupLocation: "우리집",
          groupPeopleLimit: "5",
          status: GroupStatus.PUBLIC,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          members: [],
          users: [],
          image: null,
          owner: null,
          //이하 baseEntity에서 상속받음
          hasId: () => true,
          save: () => Promise.resolve(this),
          remove: () => Promise.resolve(this),
          softRemove: () => Promise.resolve(this),
          recover: () => Promise.resolve(this),
          reload: () => Promise.resolve(this),
        },
      ];

      jest.spyOn(groupRepository, "find").mockResolvedValue(expectedResult);

      const result = await groupsService.getAllGroups();

      expect(result).toEqual(expectedResult);
      expect(groupRepository.find).toHaveBeenCalled();
    });
  });
});
