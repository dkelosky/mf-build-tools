import { ncp } from "ncp";
import { promisify } from "util";
import { render } from "../utils/render";
import { addScripts } from "../utils/add-scripts";
import { updateConfig } from "../utils/update-config";
import { writeFileSync } from "fs";


export async function genc(name: string, cwd: string) {

  copyTemplate(name, cwd);
  addScripts(name, cwd, true);

  console.log(`Scripts added!`);
}

function copyTemplate(name: string, cwd: string) {
  const TEMPLATE_CPGM_DIR = "/zossrc/cpgm";

  writeFileSync(`${cwd}${TEMPLATE_CPGM_DIR}/${name}.c`,
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
