// import {
//   ConflictException,
//   forwardRef,
//   Inject,
//   Injectable,
//   NotFoundException,
//   ParseEnumPipe,
// } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { identity } from "rxjs";
// import { User } from "src/apis/users/entities/user.entity";
// import { UsersService } from "src/apis/users/users.service";
// import { Repository } from "typeorm";
// import {
//   AgeGroup,
//   Gender,
//   QuickMatching,
// } from "../quickmatchings/entities/quickmatchings.entity";
// import { QuickMatchingService } from "../quickmatchings/quickmatchings.service";
// import { MatchingRoom } from "./entities/matchingroom.entity";

// @Injectable()
// export class MatchingRoomService {
//   constructor(
//     @InjectRepository(MatchingRoom)
//     private readonly matchingRoomRepository: Repository<MatchingRoom>,
//     @InjectRepository(QuickMatching)
//     private readonly quickMatchingRepository: Repository<QuickMatching>,
//     @Inject(forwardRef(() => UsersService))
//     private usersService: UsersService,
//     @Inject(forwardRef(() => QuickMatchingService))
//     private quickMatchingService: QuickMatchingService
//   ) {}

//   async checkMatching({
//     userId,
//     myGender,
//     myAgeGroup,
//     targetGender,
//     targetAgeGroup,
//     quickMatchingId,
//   }: {
//     userId: string;
//     myGender: Gender;
//     myAgeGroup: string;
//     targetGender: Gender;
//     targetAgeGroup: AgeGroup;
//     quickMatchingId: QuickMatching;
//   }): Promise<MatchingRoom> {
//     // const existingUser = await this.matchingRoomRepository.findOne({
//     //   where: { user: { id: userId } },
//     // });
//     // if (existingUser) {
//     //   throw new ConflictException("유저가 이미 매칭 요청을 하였습니다.");
//     // }

//     const user = await this.usersService.findOneId(userId); // 내정보
//     // const quickMatching = await this.quickMatchingService.create(userId, {
//     //   gender,
//     //   ageGroup,
//     // });

//     // 매칭이 되는걸 matchingRoom 이라고 하고 그걸 save
//     const matchingRoom = new MatchingRoom();
//     matchingRoom.quickMatching = quickMatchingId;
//     //matchingRoom.user = user;
//     //matchingRoom.targetUser = targetUser;
//     matchingRoom.requestAgeGroup = targetAgeGroup;
//     matchingRoom.requestGender = targetGender;
//     matchingRoom.user = user;
//     const savedMatchingRoom = await this.matchingRoomRepository.save(
//       matchingRoom
//     );
//     console.log(user, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", savedMatchingRoom);
//     //Check if there is a matching user in the matching room
//     const targetUser = await this.findTargetUser(savedMatchingRoom);
//     if (targetUser) {
//       // 조건 비교
//     }
//     return savedMatchingRoom;
//   }

//   // async getMatchingUserInfo(targetUserId): Promise<User>{
//   //   const matchingUser = await this.usersServi
//   //   return
//   // }
//   async findTargetUser(id): Promise<QuickMatching> {
//     // 1. 모든 퀵매칭 요청을 찾아옴
//     const quickMatching =
//       await this.quickMatchingService.findAllRequestMatching(); // 모든 퀵매칭, 유저 정보 같이
//     //console.log(quickMatching, "============================");

//     if (!quickMatching) {
//       throw new NotFoundException("존재하는 매칭이 없습니다.");
//     }

//     //2. 조건 매칭
//     // 나를 제외시켜야함
//     //const targetUser = quickMatching[0].user;
//     quickMatching[0].user.age;

//     //const targetAgeGroup = this.getAgeGroup(targetAge);
//     // if (!targetUser) {//시간 제한으로 퀵매칭 유저가 없어도 기다려야함

//     //   throw new NotFoundException("대상 사용 찾을 수 없습니다");
//     // }

//     //---------------------------------------------
//     const succeedMatching: QuickMatching[] = [];
//     for (let i = 0; i < quickMatching.length; i++) {
//       const applicant = quickMatching[i];
//       const targetAgeGroup = applicant.targetAgeGroup;
//       const targetGender = applicant.targetGender;

//       // 자신의 정보와 일치하지 않는 다른 유저들을 선택
//       const otherUsers = quickMatching.filter(
//         (match) => match.user.id !== applicant.user.id // 자신의 정보를 제외
//       );

//       // 두 번째 for문: 다른 유저들과의 매칭 확인
//       for (let j = 0; j < otherUsers.length; j++) {
//         const otherUser = otherUsers[j].user; // 다른 유저의 정보
//         const userAge = otherUser.age;
//         const userAgeGroup = this.getAgeGroup(userAge);

//         console.log("++++++++++++++++++++++++++++++++++++++++++++++=");
//         console.log(
//           applicant,
//           targetAgeGroup,
//           targetGender,
//           otherUser,
//           userAgeGroup
//         );

//         if (
//           otherUser.gender === targetGender &&
//           userAgeGroup === targetAgeGroup &&
//           applicant.targetGender === targetGender &&
//           applicant.targetAgeGroup === targetAgeGroup
//         ) {
//           succeedMatching.push(applicant);
//         }
//       }
//     }

//     // const { targetGender, targetAgeGroup } = quickMatching; // 유저가 원하는 상대방의 조건인거잖아
//     console.log(
//       //targetUser, // 결국 내 정보 -> 상대방 정보 저장되게 해야함
//       //gender,// 왜 타겟 젠더가 나오지?
//       //targetGender, // 왜 내 성별?
//       //ageGroup, // 왜 타겟 나이?
//       //targetAgeGroup,
//       //targetAgeGroup, // 왜 내 나이?
//       "3333333333333333333"
//     );
//     // if (gender == targetGender && ageGroup == targetAgeGroup) {
//     //   // 나의 아이디가 포함된건 제외해야 하잖아
//     return quickMatching[0];
//     // } else {
//     //   throw new NotFoundException("조건에 일치하는 유저가 존재하지 않습니다");
//     // }

//     // 나온 퀵매칭 중에서 createdAt 제일 빠른애 순서로 정려 -> 제일 상위권인 애가 리턴되도록 하기
//   }

//   getAgeGroup(age: number): string {
//     if (age >= 10 && age <= 19) {
//       return "TEENAGER";
//     } else if (age >= 20 && age <= 29) {
//       return "TWENTIES";
//     } else if (age >= 30 && age <= 39) {
//       return "THIRTIES";
//     } else if (age >= 40 && age <= 49) {
//       return "FORTIES";
//     } else if (age >= 50 && age <= 59) {
//       return "FIFTIES";
//     } else {
//       return "기타";
//     }
//   }
//   //   async findOne(id): Promise<MatchingRoom> {
//   //     const quickMatching = await this.matchingRoomRepository.findOne({
//   //       where: { id },
//   //       relations: ["user"], // matchingChat
//   //     });
//   //     console.log(quickMatching, "111111111");
//   //     return quickMatching;
//   //   }
// }
