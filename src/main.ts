import { app, BrowserWindow, systemPreferences } from "electron";
import { createWindow } from "./core/create-window";
import { LOGIN_WINDOW_SIZE, PAGES_PATH } from "./configs";
import Path from "path";

const loginPage = Path.join(PAGES_PATH, "login.html");

let win: BrowserWindow | undefined | null;

systemPreferences.setAppLevelAppearance("dark");

app.on(
  "ready",
  () => (win = createWindow(LOGIN_WINDOW_SIZE, "file", loginPage))
);

app.on("window-all-closed", () => {
  /** 菜单栏保持激活 */
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow(LOGIN_WINDOW_SIZE);
  }
});
