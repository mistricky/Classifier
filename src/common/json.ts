import { writeFile } from "../core";
import * as Path from "path";
import { JSON_PATH } from "../configs";
import { App } from "./app-manager";

const CATEGORIES_CONFIG_FILENAME = "categories.json";

export interface AppListConfig {
  [index: string]: App;
}

export interface CategoriesConfig {
  categories: string[];
}

export async function updateJSON(fileName: string, content: string) {
  try {
    await writeFile(Path.join(JSON_PATH, fileName), content);
  } catch (e) {
    throw e;
  }
}

export function parseToConfig(map: Map<string, App>): AppListConfig {
  let config: AppListConfig = {};

  map.forEach((value, key) => {
    config[key] = value;
  });

  return config;
}

export async function parseToMap(fileName: string): Promise<Map<string, App>> {
  let config: AppListConfig = await import(Path.join(JSON_PATH, fileName));
  let appMap = new Map<string, App>();

  for (let key of Object.keys(config.default)) {
    appMap.set(key, config[key]);
  }

  return appMap;
}

export async function getCategories(): Promise<string[]> {
  let config: CategoriesConfig = await import(Path.join(
    JSON_PATH,
    CATEGORIES_CONFIG_FILENAME
  ));

  return config.categories;
}

export async function setCategories(categories: CategoriesConfig) {
  await updateJSON(CATEGORIES_CONFIG_FILENAME, JSON.stringify(categories));
}
