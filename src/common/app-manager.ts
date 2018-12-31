import * as FileIcon from "file-icon";
import { extractFileName } from "../util";
import * as Path from "path";
import { APP_ICONS_PATH } from "../configs";
import { unlinkFile } from "../core";

export interface App {
  name: string;
  path: string;
  icon: string;
}

export class AppManager {
  private constructor() {}

  static instance: AppManager;
  static createInstance() {
    return AppManager.instance || (this.instance = new AppManager());
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

  private createAppHTMLElement({ name, icon: iconPath }: App): HTMLDivElement {
    let createEle = (eleName: string, className?: string) => {
      let ele = document.createElement(eleName);

      className && (ele.className = className);
      return ele;
    };

    let app = createEle("div", "app");
    let iconDiv = createEle("div", "icon");
    let icon = createEle("img");
    let appName = createEle("p", "app-name");

    appName.innerHTML = name;
    icon.setAttribute("src", iconPath);

    iconDiv.appendChild(icon);
    app.appendChild(iconDiv);
    app.appendChild(appName);

    return app as HTMLDivElement;
  }

  async addApp(filePath: string, appName?: string) {
    let fileName = extractFileName(filePath);
    let displayName = appName || fileName;
    let iconPath = Path.join(APP_ICONS_PATH, `${displayName}.png`);

    // 写入 icon
    await FileIcon.file(fileName, {
      destination: iconPath
    });

    this._apps.set(displayName, {
      name: displayName,
      path: filePath,
      icon: iconPath
    });
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

  initDisplayApps(container: HTMLElement) {
    this._apps.forEach(app => {
      container.appendChild(this.createAppHTMLElement(app));
    });
  }

  get apps(): Map<string, App> {
    return this._apps;
  }
}
