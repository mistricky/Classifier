import { ipcMain, BrowserWindow, Event } from "electron";
import { WindowsManager } from "../core";
import {
  updateJSON,
  parseToConfig,
  AppManager,
  CategoryManager
} from "../common";
import { APP_LIST } from "../configs";
import { Events } from "../configs/event";

ipcMain.on(Events.CLOSE_TARGET_WINDOW, (_e: Event, windowName: string) => {
  WindowsManager.createInstance().closeWindow(windowName, true);
});

ipcMain.on(Events.HIDDEN_TARGET_WINDOW, (_e: Event, windowName: string) => {
  (WindowsManager.createInstance().getWindow(
    windowName
  ) as BrowserWindow).hide();
});

ipcMain.on(Events.SAVE_APP_LIST, () => {
  updateJSON(
    APP_LIST,
    JSON.stringify(parseToConfig(AppManager.createInstance().apps))
  );
});

ipcMain.on(Events.ADD_APP, async (e: Event, path: string) => {
  let app = await AppManager.createInstance().addApp(path);

  e.sender.send("add-app-reply", app);
});

ipcMain.on(Events.GET_APPS, (e: Event) => {
  e.sender.send(
    "get-apps-reply",
    parseToConfig(AppManager.createInstance().apps)
  );
});

ipcMain.on(Events.ADD_CATEGORY, (_e: Event, categoryName: string) => {
  CategoryManager.createInstance().addCategory(categoryName);
});

ipcMain.on(Events.REMOVE_CATEGORY, (_e: Event, categoryName: string) => {
  CategoryManager.createInstance().removeCategory(categoryName);
});

export {};
