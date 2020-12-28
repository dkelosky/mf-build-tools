export interface IScript {
  script: string;
  command: string;
}

export const cScripts: IScript[] = [
  {
    script: `z:upload:{{{name}}}`,
    command: `npm run upload -- -s cpgm/{{{name}}}.c`,
  },
  {
    script: `build:{{{name}}}`,
    command: `npm run z:upload:{{{name}}} && npm run z:genbuildjcl:build:{{{name}}} && npm run z:submit:build:{{{name}}}`,
  },
  {
    script: `execute:{{{name}}}`,
    command: `npm run z:genbuildjcl:execute:{{{name}}} && npm run z:submit:execute:{{{name}}}`,
  },
  {
    script: `z:submit:build:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/build_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `z:submit:execute:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/execute_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `z:genbuildjcl:build:{{{name}}}`,
    command: `npm run z:genbuildjcl -- jcl-out-file=./lib/jcl/build_{{{name}}}.jcl compile/{{{name}}} assemble/{{{name}}} bind/{{{name}}}`,
  },
  {
    script: `z:genbuildjcl:execute:{{{name}}}`,
    command: `npm run z:genbuildjcl -- jcl-out-file=./lib/jcl/execute_{{{name}}}.jcl execute/{{{name}}}`,
  },
];

export const asmScripts: IScript[] = [
  {
    script: `z:upload:{{{name}}}`,
    command: `npm run upload -- -s asmpgm/{{{name}}}.asm`,
  },
  {
    script: `build:{{{name}}}`,
    command: `npm run z:upload:{{{name}}} && npm run z:genbuildjcl:build:{{{name}}} && npm run z:submit:build:{{{name}}}`,
  },
  {
    script: `execute:{{{name}}}`,
    command: `npm run z:genbuildjcl:execute:{{{name}}} && npm run z:submit:execute:{{{name}}}`,
  },
  {
    script: `z:submit:build:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/build_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `z:submit:execute:{{{name}}}`,
    command: "zowe jobs submit lf \"./lib/jcl/execute_{{{name}}}.jcl\" --directory \"./output\"",
  },
  {
    script: `z:genbuildjcl:build:{{{name}}}`,
    command: `npm run z:genbuildjcl -- jcl-out-file=./lib/jcl/build_{{{name}}}.jcl assemble/{{{name}}} bind/{{{name}}}`,
  },
  {
    script: `z:genbuildjcl:execute:{{{name}}}`,
    command: `npm run z:genbuildjcl -- jcl-out-file=./lib/jcl/execute_{{{name}}}.jcl execute/{{{name}}}`,
  },
];

// export const chdsectScripts: IScript[] = [
//   {
//     script: `submit:chdsect:{{{name}}}`,
//     command: "zowe jobs submit lf \"./lib/jcl/chdsect_{{{name}}}.jcl\" --directory \"./output\"",
//   },
//   {
//     script: `genchdsectjcl:chdsect:{{{name}}}`,
//     command: `npm run genchdsectjcl -- jcl-out-file=./lib/jcl/chdsect_{{{name}}}.jcl`,
//   },
// ];
