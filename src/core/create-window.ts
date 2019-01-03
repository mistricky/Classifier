import { BrowserWindow, remote, Options } from "electron";
import { WindowsManager } from "./windows-manager";

export interface WindowSize {
  height: number;
  width: number;
}

export type WindowCloseHandler = () => void;
export type LoadType = "url" | "file";
export type ProcessType = "render" | "main";
export type WindowLoadedHandler = () => void;

export function createWindow(
  windowSize: WindowSize,
  windowName: string,
  processType?: ProcessType,
  loadType?: LoadType,
  loadPath?: string,
  handleWindowLoaded?: WindowLoadedHandler,
  handleWindowClose?: WindowCloseHandler
) {
  let options = Object.assign({}, windowSize, {
    show: false,
    resizable: false,
    devTools: false
  });

  let windowsManager = WindowsManager.createInstance();
  let win: BrowserWindow | undefined | null =
    !processType || processType === "main"
      ? new BrowserWindow(options)
      : new remote.BrowserWindow(options);

  windowsManager.addWindow(windowName, win);

  if (loadType && loadPath) {
    if (loadType === "file") {
      win.loadFile(loadPath);
    } else {
      win.loadURL(loadPath);
    }
  }

  win.on("close", () => {
    handleWindowClose && handleWindowClose();
    windowsManager.closeWindow(windowName);
    win = null;
  });

  /** 防止页面抖动 */
  win.on("ready-to-show", () => {
    win!.show();
    handleWindowLoaded && handleWindowLoaded();
  });

  return win;
}
