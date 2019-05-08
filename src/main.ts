#!/usr/bin/env node
import { version, command, parse, help, Command, description } from "commander";
import { init } from "./commands/init";
import { update } from "./commands/update";
import { genasm } from "./commands/genasm";

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
  .description("initialize a project")
  .action((name: string, cmdObj: Command) => {
    init(name, cmdObj);
  });

command("update")
  .description("update JCL templates & scripts")
  .action(() => {
    update();
  });

command("generate <name>")
  // .option("-d, --deploy", "include deploy")
  .option("-c, --chdsect", "include chdsect")
  .option("-o, --only", "skip other scripts")
  .description("generate new entry")
  .action((name: string, cmdObj: Command) => {
    genasm(name, `.`, cmdObj);
  });

const cmd = parse(process.argv);

if (cmd.args.length === 0) {
  help();
}
