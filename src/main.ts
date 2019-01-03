import { app, BrowserWindow, systemPreferences } from "electron";
import { createWindow } from "./core/create-window";
import { LOGIN_WINDOW_SIZE, PAGES_PATH, APP_LIST } from "./configs";
import Path from "path";
import "./main/process-channel";
import {
  AppManager,
  parseToMap,
  updateJSON,
  parseToConfig,
  setCategories,
  CategoryManager,
  getCategories
} from "./common";

const loginPage = Path.join(PAGES_PATH, "login.html");

let win: BrowserWindow | undefined | null;

systemPreferences.setAppLevelAppearance("dark");

app.on("ready", async () => {
  win = createWindow(LOGIN_WINDOW_SIZE, "login", "main", "file", loginPage);
  AppManager.createInstance().apps = await parseToMap(APP_LIST);
  CategoryManager.createInstance().categories = await getCategories();
});

app.on("window-all-closed", () => {
  /** 菜单栏保持激活 */
  if (process.platform != "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow(LOGIN_WINDOW_SIZE, "login");
  }
});

app.on("quit", () => {
  updateJSON(
    APP_LIST,
    JSON.stringify(parseToConfig(AppManager.createInstance().apps))
  );

  setCategories({ categories: CategoryManager.createInstance().categories });
});
