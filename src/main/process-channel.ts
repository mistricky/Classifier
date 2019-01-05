import { ipcMain, BrowserWindow, Event } from "electron";
import { WindowsManager, ReplyMessage } from "../core";
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

ipcMain.on(Events.ADD_APP, async (e: Event, path: string, category: string) => {
  let appManager = AppManager.createInstance();

  let replyMessage = await appManager.addApp(path, category);

  e.sender.send(Events.ADD_APP_REPLY, replyMessage);
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

ipcMain.on(Events.GET_CATEGORIES, (e: Event) => {
  e.sender.send(
    Events.GET_CATEGORIES_REPLY,
    CategoryManager.createInstance().categories
  );
});

export {};
