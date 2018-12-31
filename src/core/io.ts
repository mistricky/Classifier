import { promisify } from "util";
import FS from "fs";

export const readFile = promisify(FS.readFile);
export const writeFile = promisify(FS.writeFile);
