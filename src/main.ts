#!/usr/bin/env node
import { version, command, option, action, parse, help, Command } from "commander";

version(`0.0.1`);

// command('rm <dir>')
//   .option('-r, --recursive', 'Remove recursively')
//   .action(function (dir: any, cmd: any) {
//     console.log(`dir ${dir} cmd ${cmd}`)
//   })

command("init")
  .description("initialize a project")
  .action(() => {
    console.log(`called init`)
  });

const cmd = parse(process.argv)

if (cmd.args.length === 0) {
  help();
}
