import { compile } from "handlebars";
import { scripts } from "../utils/constant";
import { readFileSync, writeFileSync } from "fs";

export async function generate(name: string) {

  console.log(`Adding scripts...`);

  const data = { name };

  const pkg = JSON.parse(readFileSync("package.json").toString());

  scripts.forEach((entry) => {
    const script = compile(entry.script)(data);
    const command = compile(entry.command)(data);
    pkg.scripts[script] = command;
  });

  writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  console.log(`Scripts added!`);
}
