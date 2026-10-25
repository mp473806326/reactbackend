import { defineMock } from "vite-plugin-mock-dev-server";
import { resultSuccess, resultError } from "./utils";

// 已发送的验证码，按手机号存储
const otpStore: Record<string, string> = {};

const session = {
  token: "123456abc",
  refresh: "cba654321",
};

export default defineMock([
  {
    url: "/mock/platform/login/password/",
    delay: [50, 150],
    method: ["POST"],
    body: ({ body }) => {
      const { accountName, password } = body;
      if (accountName === "admin" && password === "123456") {
        return resultSuccess(session, "登录成功");
      }
      return resultError(null, "登录名或密码错误");
    },
  },
  {
    url: "/mock/platform/login/otp/send/",
    delay: [50, 150],
    method: ["POST"],
    body: ({ body }) => {
      const { mobile } = body;
      if (!/^1\d{10}$/.test(mobile)) return resultError(null, "手机号格式不正确");
      const code = String(Math.floor(100000 + Math.random() * 900000));
      otpStore[mobile] = code;
      return resultSuccess({ debugVerificationCode: code }, "验证码已发送");
    },
  },
  {
    url: "/mock/platform/login/otp/verify/",
    delay: [50, 150],
    method: ["POST"],
    body: ({ body }) => {
      const { mobile, code } = body;
      if (!otpStore[mobile] || otpStore[mobile] !== code) return resultError(null, "验证码错误或已过期");
      delete otpStore[mobile];
      return resultSuccess(session, "登录成功");
    },
  },
]);
