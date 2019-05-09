import { promisify } from "util";
import { readFile, writeFile, unlink } from "fs";
import { compile } from "handlebars";
import { dirname } from "path";

export async function render(path: string, data: object, newName?: string) {
  const rf = promisify(readFile);
  const file = await rf(path);
  const template = compile(file.toString());
  const result = template(data);
  const wf = promisify(writeFile);
  const df = promisify(unlink);

  if (newName) {
    await df(path);
    await wf(dirname(path) + `/${newName}`, result);
  } else {
    await wf(path, result);
  }

}
