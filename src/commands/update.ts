import { promisify } from "util";
import { ncp } from "ncp";
import { run } from "../utils/run";

export async function update() {
  const cp = promisify(ncp);
  await cp(`${__dirname}/../../starter/templates`, `templates`);
  await cp(`${__dirname}/../../starter/scripts`, `scripts`);
  console.log(`Script files updated...`);

  console.log(`Rebuilding scripts...`);
  await run(`npm run build:scripts`);

  console.log(`Update complete!`);
}
