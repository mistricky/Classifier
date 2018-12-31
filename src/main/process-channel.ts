import { ipcMain, BrowserWindow, Event } from "electron";
import { WindowsManager } from "../core";
import { updateJSON, parseToConfig, AppManager } from "../common";
import { APP_LIST } from "../configs";

ipcMain.on("close-target-window", (_e: Event, windowName: string) => {
  WindowsManager.createInstance().closeWindow(windowName, true);
});

ipcMain.on("hidden-target-window", (_e: Event, windowName: string) => {
  (WindowsManager.createInstance().getWindow(
    windowName
  ) as BrowserWindow).hide();
});

ipcMain.on("save-app-list", () => {
  updateJSON(
    APP_LIST,
    JSON.stringify(parseToConfig(AppManager.createInstance().apps))
  );
});

ipcMain.on("add-app", async (e: Event, path: string) => {
  let app = await AppManager.createInstance().addApp(path);

  e.sender.send("add-app-reply", app);
});

ipcMain.on("get-apps", (e: Event) => {
  e.sender.send(
    "get-apps-reply",
    parseToConfig(AppManager.createInstance().apps)
  );
});

export {};
