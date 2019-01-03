import * as FileIcon from "file-icon";
import { extractFileName } from "../util";
import * as Path from "path";
import { APP_ICONS_PATH } from "../configs";
import { unlinkFile } from "../core";

export interface App {
  name: string;
  path: string;
  icon: string;
  category: string;
}

export class AppManager {
  private constructor() {}

  static instance: AppManager;
  static createInstance() {
    return AppManager.instance || (AppManager.instance = new AppManager());
  }

  private _apps: Map<string, App> = new Map();

  private async clearApp(iconPath: string, appName: string) {
    this._apps.delete(appName);
    try {
      await unlinkFile(iconPath);
    } catch (e) {
      throw e;
    }
  }

  async addApp(filePath: string, category: string, appName?: string) {
    let fileName = extractFileName(filePath);
    let displayName = appName || fileName;
    let iconPath = Path.join(APP_ICONS_PATH, `${displayName}.png`);
    let app = {
      name: displayName,
      path: filePath,
      icon: iconPath,
      category
    };

    this._apps.set(displayName, app);

    // 写入 icon
    await FileIcon.file(fileName, {
      destination: iconPath
    });

    return app;
  }

  async removeApp(appName: string): Promise<boolean> {
    // 探测是否存在，减少删除开销
    let result = this._apps.get(appName);

    if (!result) {
      return !!result;
    }

    let { icon } = result;
    this.clearApp(icon, appName);

    return true;
  }

  get apps(): Map<string, App> {
    return this._apps;
  }

  set apps(apps: Map<string, App>) {
    this._apps = apps;
  }
}
