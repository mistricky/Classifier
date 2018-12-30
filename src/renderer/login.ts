import { createWindow, WindowsManager } from "../core";
import { PAGES_PATH, USER_INFO } from "../configs";
import Path from "path";
import { ipcRenderer } from "electron";

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
    return;
  }

  createWindow({ width: 400, height: 600 }, "main", "render", "file", mainPage);

  // 通知隐藏 login
  ipcRenderer.send("hidden-target-window", "login");
}

export function handleInputChange(value: string, type: InputType) {
  formData[type] = value;
}
