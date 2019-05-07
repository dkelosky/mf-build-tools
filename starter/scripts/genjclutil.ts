import { dirname } from "path";
import mkdirp = require("mkdirp");
import { readFileSync, existsSync, writeFileSync } from "fs";
import * as handlebars from "handlebars";

export function getOutFile(defaultOutFile: string) {
  const jclOutFileKey = `jcl-out-file=`;
  let jclOutFile = defaultOutFile;

  const numOfParms = process.argv.length - 2;
  if (numOfParms > 0) {
    for (let i = 0; i < numOfParms; i++) {

      const parm = process.argv[2 + i];

      if (parm.indexOf(jclOutFileKey) === 0) {
        jclOutFile = parm.substr(jclOutFileKey.length, parm.length - jclOutFileKey.length);
        continue;
      }

    }
  }
  return jclOutFile;
}

export function render(templateFile: string, data: object, outFile: string) {
  const jcl = readFileSync(`${templateFile}`).toString();
  const compiled = handlebars.compile(jcl);
  const rendered = compiled(data);

  if (!existsSync(dirname(outFile))) mkdirp.sync(dirname(outFile));
  writeFileSync(`${outFile}`, rendered);
  console.log(`Generated custom JCL to ${outFile}`);
}
