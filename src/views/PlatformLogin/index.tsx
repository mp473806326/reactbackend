import { useState } from "react";
import { Alert, Button, ConfigProvider, Form, Input, Space, Tabs } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserInfoStore } from "@/store/userInfo";
import { sendPlatformLoginOtp } from "@/api";
import { AdMessage } from "@/utils/AntdGlobal";
import { formatErrMsg } from "@/utils/common";
import { Local } from "@/utils/storage";
import { platformAdminTheme, platformAdminStartupProfile } from "@/styles/platformAdminTheme";
import "@/styles/platformAdmin.scss";
import styles from "./index.module.scss";

type LoginMode = "PASSWORD" | "OTP";
type LoginValue = { accountName?: string; password?: string; mobile?: string; code?: string };

const MOBILE_PATTERN = /^1\d{10}$/;

export default function PlatformLogin() {
  const [mode, setMode] = useState<LoginMode>("PASSWORD");
  const [problem, setProblem] = useState<string>();
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [form] = Form.useForm<LoginValue>();
  const navigate = useNavigate();
  const location = useLocation();
  const updateUserInfo = useUserInfoStore(state => state.updateUserInfo);

  // 切换登录方式时重置表单
  const resetForMode = (next: LoginMode) => {
    setMode(next);
    setProblem(undefined);
    setOtpSent(false);
    form.resetFields();
  };

  // 发送手机验证码
  const sendOtp = async () => {
    let mobile: string | undefined;
    try {
      ({ mobile } = await form.validateFields(["mobile"]));
    } catch {
      return;
    }
    setSendingOtp(true);
    setProblem(undefined);
    try {
      const { code, data, message } = await sendPlatformLoginOtp({ mobile: mobile ?? "" });
      if (code !== 200) {
        setOtpSent(false);
        setProblem(formatErrMsg(message));
        return;
      }
      form.setFieldValue("code", data?.debugVerificationCode ?? undefined);
      setOtpSent(true);
    } catch {
      setOtpSent(false);
      setProblem("验证码发送失败，请稍后重试");
    } finally {
      setSendingOtp(false);
    }
  };

  // 暂不校验账号，直接写入 mock 会话并跳转
  const handleLogin = () => {
    const userInfo: UserInfoType = { id: 1, avatar: null, username: "admin" };
    Local.set("token", "123456abc");
    Local.set("refresh", "cba654321");
    Local.set("userInfo", userInfo);
    updateUserInfo(userInfo);
    AdMessage.success("登录成功");
    navigate(location.state?.from || "/groupSpace", { replace: true });
  };

  return (
    <ConfigProvider theme={platformAdminTheme}>
      <div className={`platform-admin ${styles.page}`}>
        <div className={styles.container}>
          <div className={styles.top}>
            <div className={styles.header}>
              <span className={styles.logo}>
                <LockOutlined />
              </span>
              <span className={styles.title}>{platformAdminStartupProfile.title}</span>
            </div>
            <div className={styles.desc}>请使用账号登录</div>
          </div>
          <div className={styles.main}>
            <Form<LoginValue> form={form} layout="vertical">
              {problem && <Alert type="error" showIcon message={problem} />}
              <Tabs
                activeKey={mode}
                onChange={key => resetForMode(key as LoginMode)}
                items={[
                  { key: "PASSWORD", label: "账号密码登录", disabled: sendingOtp },
                  { key: "OTP", label: "手机验证码登录", disabled: sendingOtp },
                ]}
              />
              {mode === "PASSWORD" ? (
                <>
                  <Form.Item
                    name="accountName"
                    label="登录名"
                    rules={[{ required: true, whitespace: true, message: "请输入登录名" }]}
                  >
                    <Input autoComplete="username" />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="登录密码"
                    rules={[{ required: true, message: "请输入登录密码" }]}
                  >
                    <Input.Password autoComplete="current-password" />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    name="mobile"
                    label="手机号"
                    rules={[{ required: true, pattern: MOBILE_PATTERN, message: "请输入正确的手机号" }]}
                  >
                    <Input
                      disabled={sendingOtp}
                      onChange={() => {
                        setOtpSent(false);
                        form.setFieldValue("code", undefined);
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="验证码" required>
                    <Space.Compact block>
                      <Form.Item
                        name="code"
                        noStyle
                        rules={[{ required: true, pattern: /^\d{6}$/, message: "请输入6位验证码" }]}
                      >
                        <Input disabled={!otpSent} />
                      </Form.Item>
                      <Button
                        htmlType="button"
                        onClick={() => void sendOtp()}
                        loading={sendingOtp}
                        disabled={sendingOtp}
                      >
                        获取验证码
                      </Button>
                    </Space.Compact>
                  </Form.Item>
                  {otpSent && <Alert type="success" showIcon message="验证码已发送，请在有效期内填写" />}
                </>
              )}
              <Button
                type="primary"
                htmlType="button"
                size="large"
                block
                disabled={sendingOtp}
                onClick={handleLogin}
              >
                {mode === "PASSWORD" ? "登录" : "验证并登录"}
              </Button>
            </Form>
            {mode === "PASSWORD" && (
              <div className={styles.other}>
                <Button
                  type="link"
                  disabled={sendingOtp}
                  onClick={() => AdMessage.info("请联系管理员重置密码")}
                >
                  忘记密码
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
