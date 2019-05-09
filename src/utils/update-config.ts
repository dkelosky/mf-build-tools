import { readFileSync, writeFileSync } from "fs";

export function updateConfig(name: string, ids: string[]) {
  try {
    let file = readFileSync(`config/default.ts`).toString();

    if (file.indexOf(name.toUpperCase()) > 0) {
      console.warn(`\n >>> Skipping config update, ${name.toUpperCase()} found in file << <\n`);
    } else {

      const lines = file.split(`\n`);
      const positions: number[] = [];

      // find indexes
      for (let i = 0; i < lines.length; i++) {
        for (let id of ids) {
          if (lines[i].indexOf(id) > 0) {
            positions.push(i + 1);
          }
        }
      }

      // add to each
      let accumulator = 0;
      for (let pos of positions) {
        lines.splice(pos + accumulator++, 0, `        "${name.toUpperCase()}": {},`);
      }

      writeFileSync(`config/default.ts`, lines.join(`\n`));
    }

  } catch (err) {
    console.error(`\n>>> Config update failure <<<\n${err}\n`);
  }
}
