import bindOptions from "./imports/bind/bindOptions";
import dataSets from "./imports/dataSets";
import uploads from "./imports/uploads";
import assemblyOptions from "./imports/assembly/assemblyOptions";
import assemblyMaclibs from "./imports/assembly/assemblyMaclibs";
import metalOptions64 from "./imports/metal/metalOptions64";
import metalIncludes from "./imports/metal/metalIncludes";
import metalOptions from "./imports/metal/metalOptions";

export default {

  // settings for all other sections
  settings: {
    hlq: "PUBLIC.TEMPLATE",
    name: "TEMPLATE",
    account: "#ACCT",
    description: "ASM/BIND/RUN",
    messageClass: "A",
    jobClass: "A",
  },

  // working data sets to allocate
  dataSets,

  // mapping local z/OS to LLQ data sets
  uploads,

  // job info
  job: {

    // assemble configuration
    assemble: {
      options: assemblyOptions,
      includes: assemblyMaclibs,
      sources: {
        TEMPLATE: {
          // override options here
        },
      },
    },

    // bind configuration
    bind: {
      options: bindOptions,
      // includes: nothing included in every bind right now
      sources: {
        TEMPLATE: {
          // override options here

          // include data sets containing objects
          includes: [
          ],

          // include certain objects
          objects: [

          ]
        },
      }
    },

    // executables
    execute: {
      // options: no parms to every exec right now (options are PARM=)
      sources: {
        TEMPLATE: {
          // override options here (options are PARM=)
          options: "'HELLO WORLD'",
        },
      }
    }
  },

  deploy: {
    ftp: {
      options: [
        "cd 'KELDA16.WORK.LOADLIB'",
        "mdelete *"
      ],
      includes: [
        "TEMPLATE",
      ],
      sources: {
        CA11: {},
      }
    }
  },
}