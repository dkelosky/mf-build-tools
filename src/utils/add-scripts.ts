import { readFileSync, writeFileSync } from "fs";
import { asmScripts, cScripts } from "./constants";
import { compile } from "handlebars";


interface IData {
  name: string;
  target?: string;
}

export function addScripts(name: string, cdw: string, c = false) {

  const PACKAGE_JSON = "/package.json";

  console.log(`Adding scripts...`);

  const data: IData = { name };
  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(`${cdw}${PACKAGE_JSON}`).toString());

    if (c) {
      cScripts.forEach((entry) => {
        const script = compile(entry.script)(data);
        const command = compile(entry.command)(data);
        pkg.scripts[script] = command;
      });
    } else {
      asmScripts.forEach((entry) => {
        const script = compile(entry.script)(data);
        const command = compile(entry.command)(data);
        pkg.scripts[script] = command;
      });
    }

    pkg = orderScriptKeys(pkg);

    writeFileSync(`${cdw}${PACKAGE_JSON}`, JSON.stringify(pkg, null, 2));
  } catch (err) {
    console.error(err);
    throw new Error(`Generate failed`);
  }
}

function orderScriptKeys(pkg: any) {
  const allScripts: any = {}
  Object.assign(allScripts, pkg[`scripts`]); // copy
  delete pkg[`scripts`]; // remove
  pkg[`scripts`] = {};
  const sortedKeys = Object.keys(allScripts).sort();
  for (let key of sortedKeys) {
    pkg[`scripts`][key] = allScripts[key];
  }
  return pkg;
}
