import * as Path from "path";

export function extractFileName(path: string) {
  return Path.basename(path).replace(
    new RegExp(`(.+?\.)${Path.extname(path)}`),
    (_match, capture) => capture
  );
}
