import { ipcRenderer, remote } from "electron";
import { App, AppListConfig, exportConfig, updateJSON } from "../common";
import { exec } from "child_process";
import { Events, APP_LIST } from "../configs";
import { escapeAll } from "../util";

import "./process-channel";

let { dialog } = remote;

const MAIN_PAGE_NAME = "主页";

type ModalOkAction = "add" | "remove";

/** TODO: 换成 jq */
let modalTitle = document.querySelector(".modal-header");
let modalOkAction: ModalOkAction = "add";
let currentCategory = "main";

export const unHoverCategoryClassName = "un-hover-category";
export let container = document.querySelector(".container");
export let categories = document.querySelector(".categories");
export let categoryNameInput = document.querySelector(
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

function setTitle(title: string) {
  modalTitle!.textContent = title;
}

function clearInputContent() {
  categoryNameInput.value = "";
}

export function clearContainer() {
  container!.innerHTML = "";
}

export function traverseCategories(cb: (ele: Element) => void) {
  let categories = document.querySelectorAll(".category");

  categories.forEach(ele => cb(ele));
}

export function createCategoryNode(content: string): Node | undefined {
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

export function createAppHTMLElement({
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
    exec(`open ${escapeAll(path)}`, err => console.error(err));
  };

  return app as HTMLDivElement;
}

export function initDisplayApps(apps: AppListConfig, container: HTMLElement) {
  container = container;

  for (let key of Object.keys(apps)) {
    let app = apps[key];

    /** 过滤 App */
    if (app.category !== currentCategory && currentCategory !== "main") {
      continue;
    }

    container.appendChild(createAppHTMLElement(app));
  }
}

export function handleDragOver(e: Event) {
  e.preventDefault();
}

export async function handleAreaDrop(e: Event) {
  e.preventDefault();

  let file = (e as DragEvent).dataTransfer!.files[0];

  ipcRenderer.send(Events.ADD_APP, file.path, currentCategory || "main");
}

export function handlePageLoaded() {
  ipcRenderer.send(Events.GET_APPS);
  ipcRenderer.send(Events.GET_CATEGORIES);
}

export async function handleCategoryClick(e: Event) {
  let targetEle = e.target as HTMLDivElement;

  await ipcRenderer.send(Events.GET_APPS);

  traverseCategories(ele => {
    if (targetEle === ele) {
      let text = ele.textContent;

      currentCategory =
        text!.trim() === MAIN_PAGE_NAME ? "main" : (text as string);
      targetEle.classList.remove(unHoverCategoryClassName);
    } else {
      ele.classList.add(unHoverCategoryClassName);
    }
  });
}

export function handleAddCategoryClick() {
  modalOkAction = "add";
  clearInputContent();
  setTitle("添加分组");
  showModal();
}

export function addCategory(categoryName: string | undefined) {
  let ele = createCategoryNode(categoryName || "");

  if (ele === undefined) {
    return;
  }

  categories!.appendChild(ele);
}

export function removeCategory(categoryName: string) {
  let isExist: boolean | undefined;

  traverseCategories(ele => {
    if (ele.textContent === categoryName) {
      isExist = true;
      categories!.removeChild(ele);
    }
  });

  if (!isExist) {
    alert("要删除的分组不存在");
  }
}

export function handleAddCategoryOkClick() {
  let categoryName = categoryNameInput.value;

  if (categoryName === MAIN_PAGE_NAME) {
    alert("不能对主页进行操作");
  }

  if (modalOkAction === "add") {
    addCategory(categoryName);
    ipcRenderer.send(Events.ADD_CATEGORY, categoryName);
  } else {
    removeCategory(categoryName);
    ipcRenderer.send(Events.REMOVE_CATEGORY, categoryName);
  }
  hiddenModal();
}

export function handleAddCategoryCancelClick() {
  hiddenModal();
}

export function handleRemoveCategoryClick() {
  modalOkAction = "remove";
  clearInputContent();
  setTitle("删除分组");
  showModal();
}

export function handleExportConfigClick() {
  dialog.showSaveDialog(
    {
      buttonLabel: "导出配置文件",
      nameFieldLabel: "配置文件名称",
      defaultPath: "classifier.config.json"
    },
    (filename: string) => {
      ipcRenderer.send(Events.EXPORT_CONFIG, filename);
    }
  );
}

export function handleImportConfigClick() {}
