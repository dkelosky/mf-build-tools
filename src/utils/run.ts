import { exec } from "child_process";
import { promisify } from "util";

/**
 * Run `npm` commands
 * @export
 * @param {string} command
 * @param {string} [cwd=`./`]
 */
export async function run(command: string, cwd = `./`) {
  const e = promisify(exec);
  const response = await e(`${command}`, { cwd});
  console.log(response.stdout);
  console.log(response.stderr);
}
