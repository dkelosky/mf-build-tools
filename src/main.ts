#!/usr/bin/env node
import { version, command, parse, help, Command } from "commander";
import { init } from "./commands/init";

version(`0.0.1`);

command("init <name>")
  .option("-q, --hlq <hlq>", "high level qualifier")
  .option("-a, --account <account>", "job account number")
  .description("initialize a project")
  .action((name: string, cmdObj: Command) => {
    init(name, cmdObj);
  });

const cmd = parse(process.argv);

if (cmd.args.length === 0) {
  help();
}
