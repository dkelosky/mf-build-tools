import { compile } from "handlebars";
import { scripts } from "../utils/constant";
import { readFileSync, writeFileSync } from "fs";

export function generate(name: string, cdw: string) {

  console.log(`Adding scripts...`);

  const data = { name };
  let pkg: any;
  try {
    pkg = JSON.parse(readFileSync(`${cdw}/package.json`).toString());

  } catch (err) {
    console.error(err);
    throw new Error(`Generate failed`);
  }

  scripts.forEach((entry) => {
    const script = compile(entry.script)(data);
    const command = compile(entry.command)(data);
    pkg.scripts[script] = command;
  });

  writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  console.log(`Scripts added!`);
}
