// import { Injectable } from "@nestjs/common";

// @Injectable()
// export class KakaoMapService {
//   constructor(private httpService: HttpService) {}

//   async searchPlaces(query: string, location: string) {
//     const response = await this.httpService
//       .get("https://dapi.kakao.com/v2/local/search/keyword.json", {
//         params: {
//           query, //검색어
//           location, // 위치
//         },
//         headers: {
//           Authorization: "KakaoAK {YOUR_KAKAO_API_KEY}",
//         },
//       })
//       .toPromise();

//     return response.data;
//   }
// }
