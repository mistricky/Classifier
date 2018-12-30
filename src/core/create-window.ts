import { BrowserWindow } from "electron";

export interface WindowSize {
  height: number;
  width: number;
}

export type WindowCloseHandler = () => void;
export type LoadType = "url" | "file";

export function createWindow(
  windowSize: WindowSize,
  loadType?: LoadType,
  loadPath?: string,
  handleWindowClose?: WindowCloseHandler
) {
  let options = Object.assign({}, windowSize, {
    show: false
  });
  let win: BrowserWindow | undefined | null = new BrowserWindow(options);

  if (loadType && loadPath) {
    if (loadType === "file") {
      win.loadFile(loadPath);
    } else {
      win.loadURL(loadPath);
    }
  }

  win.on("close", () => {
    handleWindowClose && handleWindowClose();

    win = null;
  });

  /** 防止页面抖动 */
  win.on("ready-to-show", () => win!.show());

  return win;
}
