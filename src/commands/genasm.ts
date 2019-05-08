import { compile } from "handlebars";
import { asmScripts, deployScripts, chdsectScripts } from "../utils/script-constant";
import { readFileSync, writeFileSync, fstat } from "fs";
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
    let file = readFileSync(`config/default.ts`).toString();
    const lines = file.split(`\n`);
    const positions: number[] = [];

    // find indexes
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].indexOf(`@assembleSources`) > 0 ||
        lines[i].indexOf(`@bindSources`) > 0 ||
        lines[i].indexOf(`@executeSources`) > 0 ||
        lines[i].indexOf(`@deploySources`) > 0
      ) {
        positions.push(i + 1);
      }
    }

    // add to each
    let accumulator = 0;
    for (let pos of positions) {
      lines.splice(pos + accumulator++, 0, `        "${name.toUpperCase()}": {},`);
    }

    writeFileSync(`config/default.ts`, lines.join(`\n`));

  } catch (err) {
    console.error(`\n>>> Config update failure <<<\n${err}\n`);
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
