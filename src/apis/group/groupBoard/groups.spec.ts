import { Test, TestingModule } from "@nestjs/testing";
import { Repository } from "typeorm";
import { ChatRoom } from "../groupChat/entities/chatRooms.entity";
import { GroupChatService } from "../groupChat/groupChats.service";
import { Group } from "./entites/groups.entity";
import { Member } from "./entites/members.entity";
import { GroupsService } from "./groups.service";
import { FileUploadService } from "../../file-upload/file-upload.service";
import { UsersService } from "src/apis/users/users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { GroupChatsGateway } from "../groupChat/groupChats.gateway";
import { User } from "src/apis/users/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Chat } from "../groupChat/entities/chats.entity";
import { ChatRoomUser } from "../groupChat/entities/chatRoomUsers.entity";

const mockingRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// Partial : 타입 T의 모든 요소를 optional하게 한다.
// Record : 타입 T의 모든 K의 집합으로 타입을 만들어준다.
// keyof Repository<T> : Repository의 모든 method key를 불러온다.
// jest.Mock : 3번의 key들을 다 가짜로 만들어준다.
// type MockRepository<T = any> : 이를 type으로 정의해준다.

describe("GroupsService", () => {
  let groupsService: GroupsService;
  let usersService: UsersService;
  let fileUploadService: FileUploadService;
  let groupChatService: GroupChatService;
  let groupChatGateway: GroupChatsGateway;

  let groupRepository: MockRepository<Group>;
  let userRepository: MockRepository<User>;
  let memberRepository: MockRepository<Member>;
  let chatRoomRepository: MockRepository<ChatRoom>;
  let chatRepository: MockRepository<Chat>;
  let chatRoomUserRepository: MockRepository<ChatRoomUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        UsersService,
        FileUploadService,
        GroupChatService,
        GroupChatsGateway,
        ConfigService,
        {
          provide: getRepositoryToken(Group),
          useValue: mockingRepository(),
        },
        {
          provide: getRepositoryToken(Member),
          useValue: mockingRepository(),
        },
        {
          provide: getRepositoryToken(ChatRoom),
          useValue: mockingRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockingRepository(),
        },
        {
          provide: getRepositoryToken(Chat),
          useValue: mockingRepository(),
        },
        {
          provide: getRepositoryToken(ChatRoomUser),
          useValue: mockingRepository(),
        },
      ],
    }).compile();

    groupsService = module.get<GroupsService>(GroupsService);
    usersService = module.get<UsersService>(UsersService);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
    groupChatService = module.get<GroupChatService>(GroupChatService);
    groupChatGateway = module.get<GroupChatsGateway>(GroupChatsGateway);

    groupRepository = module.get<MockRepository<Group>>(
      getRepositoryToken(Group)
    );
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    memberRepository = module.get<MockRepository<Member>>(
      getRepositoryToken(Member)
    );
    chatRoomRepository = module.get<MockRepository<ChatRoom>>(
      getRepositoryToken(ChatRoom)
    );
    chatRepository = module.get<MockRepository<Chat>>(getRepositoryToken(Chat));
    chatRoomUserRepository = module.get<MockRepository<ChatRoomUser>>(
      getRepositoryToken(ChatRoomUser)
    );
  });

  it("test", () => {
    expect(groupsService).toBeDefined();
  });
});
