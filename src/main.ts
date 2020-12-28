#!/usr/bin/env node
import { version, command, parse, help, Command, description } from "commander";
import { init } from "./commands/init";
import { update } from "./commands/update";
import { genasm } from "./commands/genasm";
import { genc } from "./commands/genc";

version(`0.0.1`)
description(`Example:\n` +
  `  mf-build init asmtest -q kelda16.asmtest -a 105300000\n` +
  `  mf-build generate newmod\n` +
  `  mf-build generate ikjtcb --chdsect\n` +
  `  mf-build update\n`
  );

command("init <name>")
  .option("-q, --hlq <hlq>", "high level qualifier")
  .option("-a, --account <account>", "job account number")
  .option("-f, --fast", "no npm install or git init")
  .description("initialize a project")
  .action((name: string, cmdObj: Command) => {
    if (name.length > 8) {
      name = name.substr(0, 8).toLowerCase();
    }
    init(name, cmdObj);
  });

command("update")
  .description("update JCL templates & scripts")
  .action(() => {
    update();
  });

command("generate <name>")
  .option("-c, --cpgm", "generate metal c")
  .description("generate new entry")
  .action((name: string, cmdObj: Command) => {
    if (name.length > 8) {
      name = name.substr(0, 8).toLowerCase();
    }
    if (cmdObj.cpgm) {
      genc(name, `.`);
    } else {
      genasm(name, `.`);
    }
  });

const cmd = parse(process.argv);

if (cmd.args.length === 0) {
  help();
}
