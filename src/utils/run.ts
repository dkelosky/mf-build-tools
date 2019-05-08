import { exec } from "child_process";
import { promisify } from "util";

export async function run(command: string, cwd = `./`) {
  const e = promisify(exec);
  const response = await e(`${command}`, { cwd });
  console.log(response.stdout);
  console.log(response.stderr);
}
