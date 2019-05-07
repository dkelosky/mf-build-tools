import { compile } from "handlebars";
import { scripts, deployScripts, chdsectScripts } from "../utils/constant";
import { readFileSync, writeFileSync } from "fs";
import { Command } from "commander";

interface IData {
  name: string;
  target?: string;
}

export function generate(name: string, cdw: string, cmdObj?: Command) {

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
  } else {
    scripts.forEach((entry) => {
      const script = compile(entry.script)(data);
      const command = compile(entry.command)(data);
      pkg.scripts[script] = command;
    });
  }

  writeFileSync(`${cdw}/package.json`, JSON.stringify(pkg, null, 2));

  console.log(`Scripts added!`);
}
