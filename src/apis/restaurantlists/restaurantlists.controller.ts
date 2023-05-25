// 카카오맵

// import { Controller, Get, Query } from "@nestjs/common";
// import { KakaoMapService } from "./restaurantlists.service";

// @Controller("kakao-map")
// export class KakaoMapController {
//   constructor(private readonly kakaoMapService: KakaoMapService) {}

//   @Get("places")
//   async searchPlaces(
//     @Query("query") query: string,
//     @Query("location") location: string
//   ) {
//     const places = await this.kakaoMapService.searchPlaces(query, location);
//     return places;
//   }
// }

// 위의 예시에서 KakaoMapController는 /kakao-map 엔드포인트에 대한 요청을 처리하는 컨트롤러입니다.
// KakaoMapService는 실제로 카카오맵 API와 통신하는 서비스입니다.
// searchPlaces 메서드는 /kakao-map/places 엔드포인트로 GET 요청이 들어오면 호출됩니다.
// query와 location은 쿼리 파라미터로 받아온 검색어와 위치 정보입니다. kakaoMapService.searchPlaces 메서드를 사용하여 카카오맵 API를 호출하고 검색 결과를 반환합니다.

// 위의 예시는 Nest.js의 컨트롤러 예시이며, 실제로 사용하는 카카오맵 API에 따라 파라미터와 호출 방식이 다를 수 있습니다.
// 필요에 따라 컨트롤러와 서비스를 구현하여 카카오맵 API를 사용할 수 있습니다.
