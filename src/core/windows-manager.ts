import { BrowserWindow } from "electron";

export class WindowsManager {
  private static instance: WindowsManager;
  private constructor() {}

  static createInstance() {
    return (
      WindowsManager.instance ||
      (WindowsManager.instance = new WindowsManager())
    );
  }

  private windows: Map<string, BrowserWindow> = new Map();

  addWindow(key: string, window: BrowserWindow) {
    this.windows.set(key, window);
  }

  closeWindow(key: string): boolean {
    let win = this.windows.get(key);

    if (!win) {
      return false;
    }

    win.close();
    this.windows.delete(key);

    return true;
  }
}
