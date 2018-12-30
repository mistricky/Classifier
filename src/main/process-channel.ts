import { ipcMain, BrowserWindow } from "electron";
import { WindowsManager } from "../core";

ipcMain.on("close-target-window", (_e: Event, windowName: string) => {
  WindowsManager.createInstance().closeWindow(windowName, true);
});

ipcMain.on("hidden-target-window", (_e: Event, windowName: string) => {
  (WindowsManager.createInstance().getWindow(
    windowName
  ) as BrowserWindow).hide();
});

export {};
