import { ncp } from "ncp";
import { promisify } from "util";
import { render } from "../utils/render";
import { addScripts } from "../utils/add-scripts";
import { updateConfig } from "../utils/update-config";

export async function genasm(name: string, cwd: string) {

  await copyTemplate(name, cwd);
  addScripts(name, cwd);

  console.log(`Scripts added!`);
}

async function copyTemplate(name: string, cwd: string) {
  const TEMPLATE_ASM_SOURCE_DIR = `${__dirname}/../../starter/templates/asmpgm`;
  const TEMPLATE_ASM_TARGET_DIR = `${cwd}/zossrc/asmpgm`;
  const TEMPLATE_ASM_FILE = "/hlasm64.asm";
  const TEMPLATE_TARGET = `${TEMPLATE_ASM_TARGET_DIR}${TEMPLATE_ASM_FILE}`;
  const TEMPLATE_SOURCE = `${TEMPLATE_ASM_SOURCE_DIR}${TEMPLATE_ASM_FILE}`;

  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  console.log(`Creating template file in ${cwd}..`)
  try {
    await cp(`${TEMPLATE_SOURCE}`, `${TEMPLATE_TARGET}`);
  } catch (err) {
    console.error(`\n>>> Copy failure <<<\n${err}\n`);
  }

  try {
    await render(`${TEMPLATE_TARGET}`, { name: name.toUpperCase() }, `${name}.asm`);
  } catch (err) {
    console.error(`\n>>> Render failure <<<\n${err}\n`);
  }

  updateConfig(name, [`@assembleSources`, `@bindSources`, `@executeSources`, `@deploySources`]);
}
