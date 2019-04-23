import { copy } from "../utils/copy";
import { Command } from "commander";
import { readFile, writeFile } from "fs";
import { compile } from "handlebars";
import { promisify } from "util";

const CONFIG_DIR_SUFFIX = "/config";
const CONFIG_LOCAL = "/local.ts";
const PACKAGE_JSON = "/package.json";


/**
 * init command handler
 * @export
 * @param {string} name
 * @param {Command} cmdObj
 */
export async function init(name: string, cmdObj: Command) {
  await copy(name);
  render(`./${name}${CONFIG_DIR_SUFFIX}${CONFIG_LOCAL}`, {
    name,
    hlq: cmdObj.hlq || `PUBLIC`,
    account: cmdObj.account || `#ACCT`,
  });
  render(`./${name}${PACKAGE_JSON}`, {
    name,
  });
}


/**
 * Asynchronously read and write
 * @param {string} path
 * @param {object} data
 */
async function render(path: string, data: object) {
  const rf = promisify(readFile);
  const file = await rf(path);
  const template = compile(file.toString());
  const result = template(data);
  const wf = promisify(writeFile);
  await wf(path, result);
}
