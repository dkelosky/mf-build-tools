#!/usr/bin/env node
import { version, command, parse, help, Command, usage, description } from "commander";
import { init } from "./commands/init";
import { update } from "./commands/update";
import { generate } from "./commands/generate";

version(`0.0.1`)
description(`Example:\n  mf-build init asmtest -q kelda16.asmtest -a 105300000`);

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
  .description("generate new entry")
  .action((name: string) => {
    generate(name);
  });

const cmd = parse(process.argv);

if (cmd.args.length === 0) {
  help();
}
