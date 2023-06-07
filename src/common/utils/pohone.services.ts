import { Injectable, NotFoundException } from "@nestjs/common";
import coolsms from "coolsms-node-sdk";

@Injectable()
export class PhoneService {
  async sendsms({ phone, token }) {
    // apiKey, apiSecret 설정
    const messageService = new coolsms(
      process.env.COOLSMS_API_KEY,
      process.env.COOLSMS_API_SECRET
    );

    try {
      const sendResponse = messageService.sendOne({
        to: phone,
        from: process.env.COOLSMS_API_PHONE,
        text: `[BobChemi] 밥케미 인증번호 : ${token}`,
        type: "SMS",
        autoTypeDetect: false,
      });
      return {
        status: { code: 200, msg: `${token} 문자발송 완료!` },
        response: JSON.stringify(sendResponse),
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async checkPhone({ phone }) {
    if (phone.length !== 10 && phone.length !== 11) {
      throw new NotFoundException("핸드폰 번호를 제대로 입력해주세요 ");
    } else {
      return true;
    }
  }

  createToken() {
    const Token = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
    return Token;
  }

}
