import { ipcRenderer } from "electron";
import { App, AppListConfig } from "../common";
import { exec } from "child_process";
import { Events } from "../configs";

const unHoverCategoryClassName = "un-hover-category";

/** TODO: 换成 jq */
let container = document.querySelector(".container");
let categories = document.querySelector(".categories");
let categoryNameInput = document.querySelector(
  "#category-name"
) as HTMLInputElement;

$(".ui.dropdown").dropdown({
  clearable: true
});

function hiddenModal() {
  $(".ui.modal").modal("hide");
}

function showModal() {
  $(".ui.modal").modal("show");
}

function traverseCategories(cb: (ele: Element) => void) {
  let categories = document.querySelectorAll(".category");

  categories.forEach(ele => cb(ele));
}

function createCategoryNode(content: string): Node | undefined {
  if (content === "") {
    alert("分组名称不能为空");
  }

  let isCreate = true;

  traverseCategories(
    ele =>
      ele.textContent === content &&
      ((isCreate = false) || alert("已有相同的分组"))
  );

  if (!isCreate) {
    return;
  }

  let category = document
    .querySelector(".main-category")!
    .cloneNode(true) as HTMLDivElement;

  category.textContent = content;
  category.classList.remove("main-category");
  category.classList.add(unHoverCategoryClassName);

  return category;
}

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

    container.appendChild(createAppHTMLElement(app));
  }
}

export function handleDragOver(e: Event) {
  e.preventDefault();
}

export async function handleAreaDrop(e: Event) {
  e.preventDefault();

  let file = (e as DragEvent).dataTransfer!.files[0];

  ipcRenderer.send(Events.ADD_APP, file.path);
}

ipcRenderer.on(Events.ADD_APP_REPLY, (_e: Event, app: App) => {
  container!.appendChild(createAppHTMLElement(app));
});

export function handlePageLoaded() {
  ipcRenderer.on(Events.GET_APPS_REPLY, (_e: Event, apps: AppListConfig) => {
    initDisplayApps(apps, container as HTMLElement);
  });

  ipcRenderer.send(Events.GET_APPS);
}

export function handleCategoryClick(e: Event) {
  let targetEle = e.target as HTMLDivElement;

  traverseCategories(ele => {
    if (targetEle === ele) {
      targetEle.classList.remove(unHoverCategoryClassName);
    } else {
      ele.classList.add(unHoverCategoryClassName);
    }
  });
}

export function handleAddCategoryClick() {
  categoryNameInput.value = "";
  showModal();
}

export function handleAddCategoryOkClick() {
  let ele = createCategoryNode(categoryNameInput.value || "");

  if (ele === undefined) {
    return;
  }

  categories!.appendChild(ele);
  hiddenModal();
}

export function handleAddCategoryCancelClick() {
  hiddenModal();
}
