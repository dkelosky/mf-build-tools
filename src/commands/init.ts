import { Command } from "commander";
import { promisify } from "util";
import { run } from "../utils/run";
import { ncp } from "ncp";
import { render } from "../utils/render";
import { genasm } from "./genasm";

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
  await render(`${cdw}${PACKAGE_JSON}`, { name: name.toLowerCase() });
  console.log(`Initial templates rendered...`);

  // init npm
  console.log(`Initializing npm project (this may take a while)...`);
  try {
    await run(`npm install`, cdw);
  } catch (err) {
    console.error(`\n>>> Run failure <<<\n${err}\n`);
  }

  // generate first scripts
  try {
    // let cmd: Command = new Command(`fake_command`);
    // cmd.deploy = true;
    // genasm(name, cdw, cmd);
    genasm(name, cdw);
  } catch (err) {
    console.error(`\n>>> Gen failure <<<\n${err}\n`);
  }

  // init git
  console.log(`Initializing git project...`);
  await run(`git init`, cdw);
  await run(`git add .`, cdw);
  await run(`git commit -m "Initial commit"`, cdw);

  // all done
  console.log(`Initializing complete!`);
}

