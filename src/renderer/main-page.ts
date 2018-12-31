import { ipcRenderer, Config } from "electron";
import { App, AppListConfig } from "../common";
import { exec } from "child_process";

let container = document.querySelector(".container");

function createAppHTMLElement({
  name,
  icon: iconPath,
  path
}: App): HTMLDivElement {
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

  app.onclick = _e => {
    exec(`open ${path}`);
  };

  return app as HTMLDivElement;
}

function initDisplayApps(apps: AppListConfig, container: HTMLElement) {
  container = container;

  for (let key of Object.keys(apps)) {
    let app = apps[key];
    console.info(app);

    container.appendChild(createAppHTMLElement(app));
  }
}

export function handleDragOver(e: Event) {
  e.preventDefault();
}

export async function handleAreaDrop(e: Event) {
  e.preventDefault();

  let file = (e as DragEvent).dataTransfer!.files[0];

  ipcRenderer.send("add-app", file.path);
}

ipcRenderer.on("add-app-reply", (_e: Event, app: App) => {
  container!.appendChild(createAppHTMLElement(app));
});

export function handlePageLoaded() {
  ipcRenderer.on("get-apps-reply", (_e: Event, apps: AppListConfig) => {
    initDisplayApps(apps, container as HTMLElement);
  });

  ipcRenderer.send("get-apps");
}
