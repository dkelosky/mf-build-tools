import { Command } from "commander";
import { readFile, writeFile, unlink, readFileSync } from "fs";
import { compile } from "handlebars";
import { promisify } from "util";
import { run } from "../utils/run";
import { dirname } from "path";
import { ncp } from "ncp";

const CONFIG_DIR_SUFFIX = "/config";
const CONFIG_DEFAULT = "/default.ts";
const CONFIG_LOCAL = "/local.ts";
const PACKAGE_JSON = "/package.json";
const TEMPLATE_ASM_DIR = "/zossrc/asmpgm";
const TEMPLATE_ASM = "/template.asm";

/**
 * init command handler
 * @export
 * @param {string} name
 * @param {Command} cmdObj
 */
export async function init(name: string, cmdObj: Command) {

  // truncate to 8 chars
  if (name.length > 8) {
    name = name.substr(0, 8);
  }

  // copy all files
  const cdw = `./${name}`;
  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  await cp(`${__dirname}/../../starter`, cdw);

  console.log(`Script files copied...`);

  // render copied files for templates
  const hlq = cmdObj.hlq || `PUBLIC`;
  await render(`${cdw}${CONFIG_DIR_SUFFIX}${CONFIG_LOCAL}`, {
    name: name.toUpperCase(),
    hlq: hlq.toUpperCase(),
    account: cmdObj.account || `#ACCT`,
  });
  await render(`${cdw}${CONFIG_DIR_SUFFIX}${CONFIG_DEFAULT}`, { name: name.toUpperCase() });
  await render(`${cdw}${TEMPLATE_ASM_DIR}${TEMPLATE_ASM}`, { name: name.toUpperCase() }, `${name}.asm`);
  await render(`${cdw}${PACKAGE_JSON}`, { name: name.toLowerCase() }); // NOTE(Kelosky): wait for the last one only
  console.log(`Initial templates rendered...`);

  // init npm
  console.log(`Initializing npm project...`);
  await run(`npm install`, cdw);

  // init git
  console.log(`Initializing git project...`);
  await run(`git init`, cdw);
  await run(`git add .`, cdw);
  await run(`git commit -m "Initial commit"`, cdw);

  // all done
  console.log(`Initializing complete!`);
}

/**
 * Asynchronously read and write
 * @param {string} path
 * @param {object} data
 */
async function render(path: string, data: object, newName?: string) {
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
