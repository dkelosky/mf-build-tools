export interface IScript {
  script: string;
  command: string;
};

export const scripts: IScript[] = [
  {
    script: `upload:{{{name}}}`,
    command: `npm run upload -- asmpgm/{{{name}}}.asm`,
  },
  {
    script: `build:{{{name}}}`,
    command: `npm run upload:{{{name}}} && npm run genbuildjcl:build:{{{name}}} && npm run submit:build:{{{name}}}`,
  },
  {
    script: `execute:{{{name}}}`,
    command: `npm run upload:{{{name}}} && npm run genbuildjcl:execute:{{{name}}} && npm run submit:execute:{{{name}}}`,
  },
  {
    script: `submit:build:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/build_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `submit:execute:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/execute_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `genbuildjcl:build:{{{name}}}`,
    command: `npm run genbuildjcl -- jcl-out-file=./lib/jcl/build_{{{name}}}.jcl assemble/{{{name}}} bind/{{{name}}}`,
  },
  {
    script: `genbuildjcl:execute{{{name}}}`,
    command: `npm run genbuildjcl -- jcl-out-file=./lib/jcl/execute_{{{name}}}.jcl execute/{{{name}}}`,
  },
];
