import { Command } from "commander";
import { promisify } from "util";
import { run } from "../utils/run";
import { ncp } from "ncp";
import { render } from "../utils/render";
import { addScripts } from "../utils/add-scripts";
import { genasm } from "./genasm";

const CONFIG_DIR_SUFFIX = "/config";
const CONFIG_DEFAULT = "/default.ts";
const CONFIG_LOCAL = "/local.ts";
const PACKAGE_JSON = "/package.json";
const README = "/README.md";
const TEMPLATE_ASM_DIR = "/zossrc/asmpgm";
const TEMPLATE_ASM = "/template.asm";

export async function init(name: string, cmdObj: Command) {

  const cwd = `./${name}`;

  console.log(`Initializing ${cwd}...`);

  await initProject(name, cwd);
  await initRenders(name, cwd, cmdObj);
  await genasm(name, cwd);
  if (cmdObj.fast) {
    // do nothing
  } else {
    await initNpm(cwd);
    initGit(cwd);
  }

  console.log(`Initializing complete!`);
}

async function initRenders(name: string, cwd: string, cmdObj: Command) {
  // render copied files for templates
  const hlq = cmdObj.hlq || `PUBLIC`;
  await render(`${cwd}${CONFIG_DIR_SUFFIX}${CONFIG_LOCAL}`, {
    name: name.toUpperCase(),
    hlq: hlq.toUpperCase(),
    account: cmdObj.account || `#ACCT`,
  });
  await render(`${cwd}${CONFIG_DIR_SUFFIX}${CONFIG_DEFAULT}`, { name: name.toUpperCase() });
  await render(`${cwd}${README}`, { name, });
  await render(`${cwd}${PACKAGE_JSON}`, { name, });
  console.log(`Initial templates rendered...`);
}

async function initProject(name: string, cwd: string) {
  // copy all files
  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  await cp(`${__dirname}/../../starter`, cwd);

  console.log(`Script files copied...`);
}

async function initNpm(cwd: string) {
  // init npm
  console.log(`Initializing npm project (this may take a while)...`);
  try {
    await run(`npm install`, cwd);
  } catch (err) {
    console.error(`\n>>> Run failure <<<\n${err}\n`);
  }
}

async function initGit(cwd: string) {
  // init git
  console.log(`Initializing git project...`);
  await run(`git init`, cwd);
  await run(`git add .`, cwd);
  await run(`git commit -m "Initial commit"`, cwd);
}

function initAsm(name: string, cwd: string) {
  // generate first scripts
  try {
    addScripts(name, cwd);
  } catch (err) {
    console.error(`\n>>> Gen failure <<<\n${err}\n`);
  }
}
