import { ncp } from "ncp";
import { promisify } from "util";
import { render } from "../utils/render";
import { addScripts } from "../utils/add-scripts";
import { updateConfig } from "../utils/update-config";

export async function genasm(name: string, cdw: string) {

  await copyTemplate(name, cdw);
  addScripts(name, cdw);

  console.log(`Scripts added!`);
}

async function copyTemplate(name: string, cdw: string) {
  const TEMPLATE_ASM_DIR = "/zossrc/asmpgm";
  const TEMPLATE_ASM = "/template.asm";

  (ncp as any).limit = 1;
  const cp = promisify(ncp);
  console.log(`Creating template file in ${cdw}..`)
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

  updateConfig(name, [`@assembleSources`, `@bindSources`, `@executeSources`, `@deploySources`]);
}
