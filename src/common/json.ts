import { writeFile } from "../core";
import * as Path from "path";
import { JSON_PATH } from "../configs";
import { App } from "./app-manager";

export interface AppListConfig {
  [index: string]: App;
}

export async function updateJSON(fileName: string, content: string) {
  try {
    await writeFile(Path.join(JSON_PATH, fileName), content);
  } catch (e) {
    throw e;
  }
}

export async function parseToMap(fileName: string) {
  let config: AppListConfig = await import(Path.join(JSON_PATH, fileName));
  let appMap = new Map<string, App>();

  for (let key of Object.keys(config)) {
    appMap.set(key, config[key]);
  }

  return appMap;
}
