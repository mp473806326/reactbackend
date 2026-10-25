import request from "@/utils/request";

type PlatformPasswordLoginData = {
  accountName: string;
  password: string;
};

type PlatformOtpLoginData = {
  mobile: string;
  code: string;
};

// 平台账号密码登录
export function platformPasswordLogin(data: PlatformPasswordLoginData): Promise<HttpResultType> {
  return request.post("/mock/platform/login/password/", data);
}

// 发送平台登录验证码
export function sendPlatformLoginOtp(data: { mobile: string }): Promise<HttpResultType> {
  return request.post("/mock/platform/login/otp/send/", data);
}

// 平台手机验证码登录
export function verifyPlatformLoginOtp(data: PlatformOtpLoginData): Promise<HttpResultType> {
  return request.post("/mock/platform/login/otp/verify/", data);
}
