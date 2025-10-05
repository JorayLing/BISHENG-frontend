import { BookOpenIcon } from "@/components/bs-icons/bookOpen";
import { GithubIcon } from "@/components/bs-icons/github";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import json from "../../../package.json";
import { Button } from "../../components/bs-ui/button";
import { Input } from "../../components/bs-ui/input";
// import { alertContext } from "../contexts/alertContext";
import { useToast } from "@/components/bs-ui/toast/use-toast";
import { locationContext } from "@/contexts/locationContext";
import { ldapLoginApi } from "@/controllers/API/pro";
import { useNavigate } from "react-router-dom";
import {
  getCaptchaApi,
  loginApi,
  registerApi,
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

  const isLoading = false;

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
    captureAndAlertRequestErrorHoc(
      (isLDAP
        ? ldapLoginApi(mail, encryptPwd)
        : loginApi(
            mail,
            encryptPwd,
            captchaData.captcha_key,
            captchaRef.current?.value,
          )
      ).then((res: any) => {
        window.self === window.top
          ? localStorage.removeItem("ws_token")
          : localStorage.setItem("ws_token", res.access_token);
        localStorage.setItem("isLogin", "1");
        const path =
          location.href.indexOf("from=workspace") === -1 ? "" : "/workspace/";
        location.href = path ? location.origin + path : location.href;
        // location.href = __APP_ENV__.BASE_URL + '/'
      }),
      (error) => {
        if (error.indexOf("过期") !== -1) {
          // 有时间改为 code 判断
          localStorage.setItem("account", mail);
          navigate("/reset", { state: { noback: true } });
        }
      },
    );

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
            src={"/src/assets/loginbody.png"}
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
                    src={"/src/assets/username.png"}
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
                    src={"/src/assets/pasweord.png"}
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
                    onClick={handleLogin}
                  >
                    <img
                      src={"/src/assets/yellowbtn.png"}
                      className="w-[261px] h-[90px] absolute   "
                    />
                    <div className="absolute w-[100%] cursor-pointer flex items-center justify-center " style={{color: '#fff',	fontSize: '32px',lineHeight: '60px',textShadow: '0 2px 6px #DC6D0A'}}>
                      {t("login.loginButton")}
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
