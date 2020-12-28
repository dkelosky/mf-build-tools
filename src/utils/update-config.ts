import { existsSync, readFileSync, writeFileSync } from "fs";

export function updateConfig(name: string, ids: string[]) {
  try {

    let file: string;

    let fileName = `./config/default.ts`;

    // handle case where we are creating a new project versus updating an existing one in cwd
    if (existsSync(fileName)) {
      file = readFileSync(fileName).toString();
    } else {
      fileName = `./${name}/config/default.ts`;
      file = readFileSync(fileName).toString();
    }

    // 512 is where the settings.name begins in default.ts, if the name is found after this, it's already added
    if (file.indexOf(name.toUpperCase()) > 512) {
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

      writeFileSync(fileName, lines.join(`\n`));
    }

  } catch (err) {
    console.error(`\n>>> Config update failure <<<\n${err}\n`);
  }
}
