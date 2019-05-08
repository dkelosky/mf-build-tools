import { compile } from "handlebars";
import { asmScripts, deployScripts, chdsectScripts } from "../utils/script-constant";
import { readFileSync, writeFileSync } from "fs";
import { Command } from "commander";
import { ncp } from "ncp";
import { promisify } from "util";
import { render } from "../utils/render";

interface IData {
  name: string;
  target?: string;
}

export async function genasm(name: string, cdw: string, cmdObj?: Command) {

  const TEMPLATE_ASM_DIR = "/zossrc/asmpgm";
  const TEMPLATE_ASM = "/template.asm";

  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  console.log(`Creating template file in ${cdw}`)

  try {
    await cp(`${__dirname}/../../starter/zossrc/asmpgm`, `${cdw}/zossrc/asmpgm`);
  } catch (err) {
    console.error(`\n>>> Copy failure <<<\n${err}\n`);
  }

  try {
    await render(`${cdw}${TEMPLATE_ASM_DIR}${TEMPLATE_ASM}`, { name: name.toUpperCase() }, `${name}.asm`);
  } catch (err) {
    console.error(`\n>>> Render failure <<<\n${err}\n`);
  }

  console.log(`Adding scripts...`);

  const data: IData = { name };
  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(`${cdw}/package.json`).toString());

  } catch (err) {
    console.error(err);
    throw new Error(`Generate failed`);
  }

  if (cmdObj && cmdObj.deploy) {
    deployScripts.forEach((entry) => {
      const script = compile(entry.script)(data);
      const command = compile(entry.command)(data);
      pkg.scripts[script] = command;
    });
  }

  if (cmdObj && cmdObj.chdsect) {
    chdsectScripts.forEach((entry) => {
      const script = compile(entry.script)(data);
      const command = compile(entry.command)(data);
      pkg.scripts[script] = command;
    });
  }

  if (cmdObj && cmdObj.only) {
    // skip other scripts
  } else {
    asmScripts.forEach((entry) => {
      const script = compile(entry.script)(data);
      const command = compile(entry.command)(data);
      pkg.scripts[script] = command;
    });
  }

  writeFileSync(`${cdw}/package.json`, JSON.stringify(pkg, null, 2));

  console.log(`Scripts added!`);
}
