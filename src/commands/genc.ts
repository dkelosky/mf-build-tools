import { ncp } from "ncp";
import { promisify } from "util";
import { render } from "../utils/render";
import { addScripts } from "../utils/add-scripts";
import { updateConfig } from "../utils/update-config";
import { writeFileSync } from "fs";


export async function genc(name: string, cdw: string) {

  copyTemplate(name, cdw);
  addScripts(name, cdw, true);

  console.log(`Scripts added!`);
}

function copyTemplate(name: string, cdw: string) {
  const TEMPLATE_CPGM_DIR = "/zossrc/cpgm";

  writeFileSync(`${cdw}${TEMPLATE_CPGM_DIR}/${name}.c`,
    `int main() {\n` +
    `  return 0;\n` +
    `}\n`
  );

  try {
    updateConfig(name, [`@compileSources`, `@assembleSources`, `@bindSources`, `@executeSources`, `@deploySources`]);
  } catch (err) {
    console.error(`\n>>> Render failure <<<\n${err}\n`);
  }
}
