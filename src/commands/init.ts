import { copy } from "../utils/copy";
import { Command } from "commander";
import { readFile, writeFile } from "fs";
import { compile } from "handlebars";
import { promisify } from "util";
import { run } from "../utils/run";

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

  const cdw = `./${name}`;
  // console.log("@TEST")
  // console.log(`${__dirname}/../../starter`)
  await copy(`${__dirname}/../../starter`, cdw);
  console.log(`Script files copied...`);

  const data = {
    name,
    hlq: cmdObj.hlq || `PUBLIC`,
    account: cmdObj.account || `#ACCT`,
  };

  render(`${cdw}${CONFIG_DIR_SUFFIX}${CONFIG_LOCAL}`, data);
  await render(`${cdw}${PACKAGE_JSON}`, data); // NOTE(Kelosky): wait for the last one only
  console.log(`Initial templates rendered...`);

  console.log(`Initializing npm project...`);
  await run(`npm install`, cdw);

  console.log(`Initializing git project...`);
  await run(`git init`, cdw);
  await run(`git add .`, cdw);
  await run(`git commit -m "Initial commit"`, cdw);

  console.log(`Initializing complete!`);
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
