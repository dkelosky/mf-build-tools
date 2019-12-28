import { promisify } from "util";
import { readFile, writeFile, unlink } from "fs";
import { compile } from "handlebars";
import { dirname } from "path";

export async function render(path: string, data: object, newName?: string) {

  LOCAL.TS IS GITIGNORED AND THATS WHY INIT FAILS
  console.log("@TEST0")
  const rf = promisify(readFile);
  console.log("@TEST1")
  console.log(`${path}`)
  const file = await rf(path);
  console.log("@TEST2")
  const template = compile(file.toString());
  console.log("@TEST3")
  const result = template(data);
  console.log("@TEST4")
  const wf = promisify(writeFile);
  console.log("@TEST5")
  const df = promisify(unlink);
  console.log("@TEST6")

  if (newName) {
    await df(path);
    await wf(dirname(path) + `/${newName}`, result);
  } else {
    await wf(path, result);
  }

}
