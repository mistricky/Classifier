import { ipcMain, BrowserWindow, Event } from "electron";
import { WindowsManager, ReplyMessage } from "../core";
import {
  updateJSON,
  parseToConfig,
  AppManager,
  CategoryManager,
  exportConfig
} from "../common";
import { APP_LIST } from "../configs";
import { Events } from "../configs/event";

export interface UpdateSizePayload {
  windowName: string;
  width: number;
  height: number;
}

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

ipcMain.on(Events.GET_APPS_SYNC, (e: Event) => {
  e.returnValue = AppManager.createInstance().apps;
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

ipcMain.on(Events.EXPORT_CONFIG, async (_e: Event, filename: string) => {
  await updateJSON(
    APP_LIST,
    JSON.stringify(parseToConfig(AppManager.createInstance().apps))
  );
  await updateJSON(filename, await exportConfig(), "/");
});

// ipcMain.on(Events.UPDATE_SIZE,(e:Event, payload:UpdateSizePayload) =>{
//   let win = WindowsManager.createInstance()
//   console.info()
// });

export {};
