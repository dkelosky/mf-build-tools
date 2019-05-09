import { Command } from "commander";
import { promisify } from "util";
import { run } from "../utils/run";
import { ncp } from "ncp";
import { render } from "../utils/render";
import { genasm } from "./genasm";
import { addScripts } from "../utils/add-scripts";

const CONFIG_DIR_SUFFIX = "/config";
const CONFIG_DEFAULT = "/default.ts";
const CONFIG_LOCAL = "/local.ts";
const PACKAGE_JSON = "/package.json";
const README = "/README.md";
const TEMPLATE_ASM_DIR = "/zossrc/asmpgm";
const TEMPLATE_ASM = "/template.asm";

export async function init(name: string, cmdObj: Command) {

  // truncate to 8 chars
  if (name.length > 8) {
    name = name.substr(0, 8);
  }
  const cdw = `./${name}`;

  console.log(`Initializing ${cdw}...`);

  await initCopies(name, cdw);
  await initRenders(name, cdw, cmdObj);
  await initAsm(name, cdw);
  await initNpm(cdw);
  initGit(cdw);

  console.log(`Initializing complete!`);
}

async function initRenders(name: string, cdw: string, cmdObj: Command) {
  // render copied files for templates
  const hlq = cmdObj.hlq || `PUBLIC`;
  await render(`${cdw}${CONFIG_DIR_SUFFIX}${CONFIG_LOCAL}`, {
    name: name.toUpperCase(),
    hlq: hlq.toUpperCase(),
    account: cmdObj.account || `#ACCT`,
  });
  await render(`${cdw}${CONFIG_DIR_SUFFIX}${CONFIG_DEFAULT}`, { name: name.toUpperCase() });
  await render(`${cdw}${TEMPLATE_ASM_DIR}${TEMPLATE_ASM}`, { name: name.toUpperCase() }, `${name}.asm`);
  await render(`${cdw}${README}`, { name: name.toLowerCase() });
  await render(`${cdw}${PACKAGE_JSON}`, { name: name.toLowerCase() });
  console.log(`Initial templates rendered...`);

}

async function initCopies(name: string, cdw: string) {
  // copy all files
  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  await cp(`${__dirname}/../../starter`, cdw);

  console.log(`Script files copied...`);
}

async function initNpm(cdw: string) {
  // init npm
  console.log(`Initializing npm project (this may take a while)...`);
  try {
    await run(`npm install`, cdw);
  } catch (err) {
    console.error(`\n>>> Run failure <<<\n${err}\n`);
  }
}

async function initGit(cdw: string) {
  // init git
  console.log(`Initializing git project...`);
  await run(`git init`, cdw);
  await run(`git add .`, cdw);
  await run(`git commit -m "Initial commit"`, cdw);
}

function initAsm(name: string, cdw: string) {
  // generate first scripts
  try {
    addScripts(name, cdw);
  } catch (err) {
    console.error(`\n>>> Gen failure <<<\n${err}\n`);
  }
}
