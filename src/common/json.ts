import { writeFile } from "../core";
import * as Path from "path";
import { JSON_PATH } from "../configs";

export async function updateJSON(fileName: string, content: string) {
  try {
    await writeFile(Path.join(JSON_PATH, fileName), content);
  } catch (e) {
    throw e;
  }
}
