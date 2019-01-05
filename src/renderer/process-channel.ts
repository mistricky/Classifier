import { ipcRenderer } from "electron";
import { Events } from "../configs";
import {
  createAppHTMLElement,
  initDisplayApps,
  addCategory,
  container,
  clearContainer
} from "./main-page";
import { AppListConfig, App } from "../common";
import { ReplyMessage } from "../core";

ipcRenderer.on(
  Events.ADD_APP_REPLY,
  (_e: Event, replyMessage: ReplyMessage) => {
    console.info(replyMessage);
    let { status, payload } = replyMessage;
    let app = payload as App;

    if (status === "error") {
      alert(`${app.name} 已存在`);
      return;
    }

    container!.appendChild(createAppHTMLElement(app));
  }
);

ipcRenderer.on(Events.GET_APPS_REPLY, (_e: Event, apps: AppListConfig) => {
  clearContainer();
  initDisplayApps(apps, container as HTMLElement);
});

ipcRenderer.on(
  Events.GET_CATEGORIES_REPLY,
  (_e: Event, categoryData: string[]) => {
    for (let categoryName of categoryData) {
      addCategory(categoryName);
    }
  }
);

export {};
