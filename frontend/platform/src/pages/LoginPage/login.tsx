import { BookOpenIcon } from "@/components/bs-icons/bookOpen";
import { GithubIcon } from "@/components/bs-icons/github";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
// 使用相对路径引用公共资源
const loginBodyImage = '/assets/images/loginbody.png';
const usernameIcon = '/assets/images/username.png';
const passwordIcon = '/assets/images/pasweord.png';
const yellowButton = '/assets/images/yellowbtn.png';
const headIcon = '/assets/images/head.png';
const downArrowIcon = '/assets/images/downarrow.png';
import json from "../../../package.json";
import { Button } from "../../components/bs-ui/button";
import { Input } from "../../components/bs-ui/input";
// import { alertContext } from "../contexts/alertContext";
import { useToast } from "@/components/bs-ui/toast/use-toast";
import { locationContext } from "@/contexts/locationContext";
import { userContext } from "@/contexts/userContext";
import { ldapLoginApi } from "@/controllers/API/pro";
import { useNavigate } from "react-router-dom";
import {
  getCaptchaApi,
  getUserInfo,
  menuConfigApi,
  loginApi,
  registerApi,
  getDevTokenApi,
} from "../../controllers/API/user";
import { captureAndAlertRequestErrorHoc } from "../../controllers/request";
import LoginBridge from "./loginBridge";
import { PWD_RULE, handleEncrypt, handleLdapEncrypt } from "./utils";

export const LoginPage = () => {
  // const { setErrorData, setSuccessData } = useContext(alertContext);
  const { t, i18n } = useTranslation();
  const { message, toast } = useToast();
  const navigate = useNavigate();
  const { appConfig } = useContext(locationContext);
  const { user, setUser } = useContext(userContext);

  const [isLoading, setIsLoading] = useState(false);

  const mailRef = useRef(null);
  const pwdRef = useRef(null);
  const agenPwdRef = useRef(null);

  // login or register
  const [showLogin, setShowLogin] = useState(true);

  // captcha
  const captchaRef = useRef(null);
  const [captchaData, setCaptchaData] = useState({
    captcha_key: "",
    user_capthca: false,
    captcha: "",
  });

  useEffect(() => {
    fetchCaptchaData();
  }, []);

  // 监听用户信息变化
  useEffect(() => {
    if (user && user.user_id) {
      navigate("/adminNew");
    }
  }, [user]);

  const fetchCaptchaData = () => {
    getCaptchaApi().then(setCaptchaData);
  };

  const [isLDAP, setIsLDAP] = useState(false);
  const handleLogin = async () => {
    const error = [];
    const [mail, pwd] = [mailRef.current.value, pwdRef.current.value];
    if (!mail) error.push(t("login.pleaseEnterAccount"));
    if (!pwd) error.push(t("login.pleaseEnterPassword"));
    if (captchaData.user_capthca && !captchaRef.current.value)
      error.push(t("login.pleaseEnterCaptcha"));
    if (error.length)
      return message({
        title: `${t("prompt")}`,
        variant: "warning",
        description: error,
      });
    // if (error.length) return setErrorData({
    //     title: `${t('prompt')}:`,
    //     list: error,
    // });

    const encryptPwd = isLDAP
      ? await handleLdapEncrypt(pwd)
      : await handleEncrypt(pwd);
    setIsLoading(true);
    try {
      // 先登录
      const loginRes = await captureAndAlertRequestErrorHoc(
        isLDAP
          ? ldapLoginApi(mail, encryptPwd)
          : loginApi(
              mail,
              encryptPwd,
              captchaData.captcha_key,
              captchaRef.current?.value,
            )
      );

      // 处理 token
      if (window.self === window.top) {
        localStorage.removeItem("ws_token");
      } else {
        localStorage.setItem("ws_token", loginRes.access_token);
      }

      try {
        // 获取用户信息
        const userInfo = await getUserInfo(); 

        // 获取 devtoken
        try {
          const devTokenData = await getDevTokenApi({
            username: mail,
            pwd: pwd
          });
          if (devTokenData.code === 200) {
            // 存储 devtoken 到 localStorage
            localStorage.setItem('devtoken', devTokenData.ext.token);
          }
        } catch (error) {
          console.warn('Failed to get devtoken:', error);
        }
        
        try {
          const menuConfig = await menuConfigApi();
          if (Array.isArray(menuConfig)) {
            localStorage.setItem('menuConfig', JSON.stringify(menuConfig));
            // 动态更新菜单配置
            const { updateMenuGroupsConfig } = await import('../../pages/AdminNewPage/menuConfig');
            updateMenuGroupsConfig();
          }
        } catch (error) {
          console.warn('Failed to load menu config:', error);
          // 菜单配置加载失败不影响登录
        }
        // 设置登录状态
        localStorage.setItem("isLogin", "1");
        localStorage.setItem("UUR_INFO", String(userInfo.user_id));
        
        // 设置用户信息
        setUser(userInfo);
      } catch (e) {
        // 如果获取用户信息失败，清除登录状态
        localStorage.removeItem("isLogin");
        localStorage.removeItem("UUR_INFO");
        message({
          title: "登录失败",
          variant: "error",
          description: ["获取用户信息失败，请重试"],
        });
      }
    } catch (error) {
      if (typeof error === "string" && error.indexOf("过期") !== -1) {
        localStorage.setItem("account", mail);
        navigate("/reset", { state: { noback: true } });
      } else {
        message({
          title: "登录失败",
          variant: "error",
          description: [typeof error === "string" ? error : "登录失败，请重试"],
        });
      }
    } finally {
      setIsLoading(false);
    }

    fetchCaptchaData();
  };

  const handleRegister = async () => {
    const error = [];
    const [mail, pwd, apwd] = [
      mailRef.current.value,
      pwdRef.current.value,
      agenPwdRef.current.value,
    ];
    if (!mail) {
      error.push(t("login.pleaseEnterAccount"));
    }
    if (mail.length < 3) {
      error.push(t("login.accountTooShort"));
    }
    if (!/.{8,}/.test(pwd)) {
      error.push(t("login.passwordTooShort"));
    }
    if (!PWD_RULE.test(pwd)) {
      error.push(t("login.passwordError"));
    }
    if (pwd !== apwd) {
      error.push(t("login.passwordMismatch"));
    }
    if (captchaData.user_capthca && !captchaRef.current.value) {
      error.push(t("login.pleaseEnterCaptcha"));
    }
    if (error.length) {
      return message({
        title: `${t("prompt")}`,
        variant: "warning",
        description: error,
      });
    }
    const encryptPwd = await handleEncrypt(pwd);
    captureAndAlertRequestErrorHoc(
      registerApi(
        mail,
        encryptPwd,
        captchaData.captcha_key,
        captchaRef.current?.value,
      ).then((res) => {
        // setSuccessData({ title: t('login.registrationSuccess') })
        message({
          title: `${t("prompt")}`,
          variant: "success",
          description: [t("login.registrationSuccess")],
        });
        pwdRef.current.value = "";
        setShowLogin(true);
      }),
    );

    fetchCaptchaData();
  };

  return (
    <div className="w-full h-full   indexbgimage">
      <div className="fixed z-10 sm:w-[1280px] w-full sm:h-[720px] h-full translate-x-[-50%] translate-y-[-50%] left-[50%] top-[50%]   rounded-lg  overflow-hidden  bg-background-color">
        <div
          className="w-[600px]  m-[8px] hidden sm:block relative z-20"
          style={{ paddingTop: "100px" }}
        >
          <img
            src={loginBodyImage}
            alt="logo_picture"
            className="w-full h-full dark:hidden"
          />

          {/* <iframe src={__APP_ENV__.BASE_URL + '/face.html'} className='w-full h-full'></iframe>  sm:px-[266px] px-[20px] pyx-[200px]*/}
        </div>
        <div className="absolute w-full h-full z-10 flex justify-end top-0">
          <div
            className="w-[600px] px-[100px]   relative loginbgimgimg"
            style={{ paddingTop: "200px" }}
          >
            <div className="grid gap-[12px] mt-[68px]">
              <div className="grid" style={{ position: "relative" }}>
                <input
                  id="email"
                  ref={mailRef}
                  style={{ paddingLeft: "140px" }}
                  placeholder={t("login.account")}
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  className="h-[48px] w-full rounded-[40px] border border-input bg-search-input px-3 py-1 text-sm text-[#111] dark:text-gray-50 dark:bg-login-input shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <div className="absolute  top-[25px] left-[-10px] translate-y-[-50%]">
                  <img
                    src={usernameIcon}
                    alt="username"
                    className="w-[62px] h-[70px] imageShadow"
                  />
                </div>
              </div>
              <div
                className="grid"
                style={{ position: "relative", marginTop: "20px" }}
              >
                <input
                  id="pwd"
                  ref={pwdRef}
                  placeholder={t("login.password")}
                  type="password"
                  onKeyDown={(e) =>
                    e.key === "Enter" && showLogin && handleLogin()
                  }
                  className="h-[48px] w-full rounded-[40px] border border-input bg-search-input px-3 py-1 text-sm text-[#111] dark:text-gray-50 dark:bg-login-input shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
                <div className="absolute  top-[25px] left-[-10px] translate-y-[-50%]">
                  <img
                    src={passwordIcon}
                    alt="password"
                    className="w-[62px] h-[70px] imageShadow"
                  />
                </div>
              </div>
              {!showLogin && (
                <div className="grid">
                  <Input
                    id="pwd"
                    className="h-[48px] dark:bg-login-input"
                    ref={agenPwdRef}
                    placeholder={t("login.confirmPassword")}
                    type="password"
                  />
                </div>
              )}
              {captchaData.user_capthca && (
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    ref={captchaRef}
                    placeholder={t("login.pleaseEnterCaptcha")}
                    className="form-input px-4 py-2 border border-gray-300 focus:outline-none"
                  />
                  <img
                    src={"data:image/jpg;base64," + captchaData.captcha} // 这里应该是你的验证码图片的URL
                    alt="captcha"
                    onClick={fetchCaptchaData} // 这里应该是你的刷新验证码函数
                    className="cursor-pointer h-10 bg-gray-100 border border-gray-300"
                    style={{ width: "120px" }} // 根据需要调整宽度
                  />
                </div>
              )}
              {showLogin ? (
                <>
                  <div className="text-center">
                    {!isLDAP && appConfig.register && (
                      <a
                        href="javascript:;"
                        className=" text-blue-500 text-sm hover:underline"
                        onClick={() => setShowLogin(false)}
                      >
                        {t("login.noAccountRegister")}
                      </a>
                    )}
                  </div>
                  {/**     <Button
                    className="h-[48px] mt-[32px] dark:bg-button"
                    disabled={isLoading}
                    onClick={handleLogin}
                  >
                    {t("login.loginButton")}
                  </Button> */}

                  <div
                    className=" mt-[22px] flex justify-center relative"
                    onClick={!isLoading ? handleLogin : undefined}
                    style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                  >
                    <img
                      src={yellowButton}
                      className="w-[261px] h-[90px] absolute"
                      style={{ opacity: isLoading ? 0.7 : 1 }}
                    />
                    <div 
                      className="absolute w-[100%] flex items-center justify-center" 
                      style={{
                        color: '#fff',
                        fontSize: '32px',
                        lineHeight: '60px',
                        textShadow: '0 2px 6px #DC6D0A',
                        opacity: isLoading ? 0.7 : 1
                      }}
                    >
                      {isLoading ? "登录中..." : t("login.loginButton")}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <a
                      href="javascript:;"
                      className=" text-blue-500 text-sm hover:underline"
                      onClick={() => setShowLogin(true)}
                    >
                      {t("login.haveAccountLogin")}
                    </a>
                  </div>
                  <Button
                    className="h-[48px] mt-[32px] dark:bg-button"
                    disabled={isLoading}
                    onClick={handleRegister}
                  >
                    {t("login.registerButton")}
                  </Button>
                </>
              )}
              {appConfig.isPro && <LoginBridge onHasLdap={setIsLDAP} />}
            </div>
            <div className=" absolute right-[16px] bottom-[16px] flex">
              <span className="mr-4 text-sm text-gray-400 relative top-2">
                v{json.version}
              </span>
              {!appConfig.noFace && (
                <div className="help flex">
                  <a
                    href={"https://github.com/dataelement/bisheng"}
                    target="_blank"
                  >
                    <GithubIcon className="block h-[40px] w-[40px] gap-1 border p-[10px] rounded-[8px] mx-[8px] hover:bg-[#1b1f23] hover:text-[white] hover:cursor-pointer" />
                  </a>
                  <a
                    href={
                      "https://m7a7tqsztt.feishu.cn/wiki/ZxW6wZyAJicX4WkG0NqcWsbynde"
                    }
                    target="_blank"
                  >
                    <BookOpenIcon className="block h-[40px] w-[40px] gap-1 border p-[10px] rounded-[8px]  hover:bg-[#0055e3] hover:text-[white] hover:cursor-pointer" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
