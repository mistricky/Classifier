import { createWindow, WindowsManager } from "../core";
import { PAGES_PATH, USER_INFO } from "../configs";
import Path from "path";
import { ipcRenderer } from "electron";

let usernameInput: HTMLInputElement | null = document.querySelector(
  "#username"
);
let passwordInput: HTMLInputElement | null = document.querySelector(
  "#password"
);

const mainPage = Path.join(PAGES_PATH, "main.html");
export type InputType = "username" | "password";

export interface FormData {
  username: string;
  password: string;
}

let formData: FormData = { username: "", password: "" };

function validUser() {
  return (
    USER_INFO.username === formData.username &&
    USER_INFO.password === formData.password
  );
}

export function handleLoginClick() {
  if (!validUser()) {
    // TODO: modal
    alert("账号密码错误!");
    passwordInput!.focus();
    return;
  }

  createWindow(
    { width: 530, height: 600 },
    "main",
    "render",
    "file",
    mainPage,
    undefined,
    () => {
      ipcRenderer.send("save-app-list");
    }
  );

  // 通知隐藏 login
  ipcRenderer.send("hidden-target-window", "login");
}

export function handleInputChange(value: string, type: InputType) {
  formData[type] = value;
}

export function handleLoginKeyDown(e: { keyCode: number }) {
  if (e.keyCode === 13) {
    usernameInput!.blur();
    passwordInput!.blur();
    handleLoginClick();
  }
}
