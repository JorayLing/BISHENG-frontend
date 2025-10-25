import i18next from "i18next";
import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { useToast } from "@/components/bs-ui/toast/use-toast";
import { useTranslation } from "react-i18next";
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from ".";
import { Button } from "../button";
import { PasswordInput } from "../input";
import {
  changePasswordApi,
  loggedChangePasswordApi,
} from "../../../controllers/API/user";
import { captureAndAlertRequestErrorHoc } from "../../../controllers/request";
import { PWD_RULE, handleEncrypt } from "../../../pages/LoginPage/utils";
import closeIcon from "./images/close.png";
import "./index.less";

interface ResetPasswordParams {
  onSuccess?: () => void;
}

let openFn = (_: ResetPasswordParams) => {};

function ResetPasswordWrapper() {
  const [open, setOpen] = useState(false);
  const paramRef = useRef<ResetPasswordParams | null>(null);
  const { t } = useTranslation();
  const { message } = useToast();

  const currentPwdRef = useRef<HTMLInputElement>(null);
  const newPwdRef = useRef<HTMLInputElement>(null);
  const confirmPwdRef = useRef<HTMLInputElement>(null);

  openFn = (params: ResetPasswordParams) => {
    paramRef.current = params;
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    // 清空输入框
    if (currentPwdRef.current) currentPwdRef.current.value = "";
    if (newPwdRef.current) newPwdRef.current.value = "";
    if (confirmPwdRef.current) confirmPwdRef.current.value = "";
  };

  const handleResetPassword = async () => {
    const errors: string[] = [];
    const [currentPwd, newPwd, confirmPwd] = [
      currentPwdRef.current?.value,
      newPwdRef.current?.value,
      confirmPwdRef.current?.value,
    ];

    if (!currentPwd) errors.push(t("resetPassword.pleaseEnterCurrentPassword"));
    if (!newPwd) errors.push(t("resetPassword.pleaseEnterNewPassword"));
    if (!confirmPwd) errors.push(t("resetPassword.pleaseEnterConfirmPassword"));
    if (!/.{8,}/.test(newPwd))
      errors.push(t("resetPassword.newPasswordTooShort"));
    if (!PWD_RULE.test(newPwd)) errors.push(t("login.passwordError"));
    if (newPwd !== confirmPwd) errors.push(t("resetPassword.passwordMismatch"));

    if (errors.length) {
      return message({
        title: `${t("prompt")}`,
        variant: "warning",
        description: errors,
      });
    }

    const encryptCurrentPwd = await handleEncrypt(currentPwd);
    const encryptNewPwd = await handleEncrypt(newPwd);

    const res = await captureAndAlertRequestErrorHoc(
      loggedChangePasswordApi(encryptCurrentPwd, encryptNewPwd)
    );

    if (res === null) {
      message({
        title: `${t("prompt")}`,
        variant: "success",
        description: [
          t("resetPassword.passwordResetSuccess"),
          t("resetPassword.reloginTip") || "请重新登录",
        ],
      });

      close();

      // 延迟一下再执行退出登录，让用户看到成功提示
      setTimeout(() => {
        paramRef.current?.onSuccess?.();
      }, 1500);
    }
  };

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-[600px] p-0 bg-transparent border-0">
        <AlertDialogTitle className="sr-only">
          {t("resetPassword.slogen")}
        </AlertDialogTitle>
        <div className="alert-dialog-re px-10 py-8">
          <img onClick={close} className="close" src={closeIcon} alt="" />
          <div className="alert-dialog-content">
            <h2 className="text-xl font-semibold text-center mb-6 mt-[25px] text-[#0057FF]">
              {t("resetPassword.slogen")}
            </h2>
            <div className="grid gap-4 w-[80%] ml-[10%] mt-[32px]">
              <div className="grid gap-2">
                <PasswordInput
                  id="currentPassword"
                  inputClassName="h-[48px] dark:bg-login-input"
                  ref={currentPwdRef}
                  placeholder={t("resetPassword.currentPassword")}
                />
              </div>
              <div className="grid gap-2">
                <PasswordInput
                  id="newPassword"
                  inputClassName="h-[48px] dark:bg-login-input"
                  ref={newPwdRef}
                  placeholder={t("resetPassword.newPassword")}
                />
              </div>
              <div className="grid gap-2">
                <PasswordInput
                  id="confirmNewPassword"
                  inputClassName="h-[48px] dark:bg-login-input"
                  ref={confirmPwdRef}
                  placeholder={t("resetPassword.confirmNewPassword")}
                />
              </div>
            </div>
            <div className="alert-dialog-footer">
              <div 
                onClick={close}
                className="alert-dialog-cancel"
              >
                {t("cancel")}
              </div>
              <div
                onClick={handleResetPassword}
                className="alert-dialog-ok"
              >
                {t("resetPassword.resetButton")}
              </div>
            </div>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

let resetPasswordRoot: ReturnType<typeof createRoot> | null = null;

(function () {
  // 挂载组件
  let el = document.getElementById("reset-password-wrap");
  if (!el) {
    el = document.createElement("div");
    el.id = "reset-password-wrap";
    document.body.append(el);
  }
  // 统一使用 createRoot (React 18+)
  if (!resetPasswordRoot) {
    resetPasswordRoot = createRoot(el);
  }
  resetPasswordRoot.render(<ResetPasswordWrapper />);
})();

const bsResetPassword = (params: ResetPasswordParams = {}) => {
  openFn(params);
};

export { bsResetPassword };

