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
    name: "{{{name}}}",
    account: "#ACCT",
    description: "COMP/ASM/BIND/RUN",
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
        /// @assembleSources - THIS MUST FOLLOW job.assemble.sources
        "{{{name}}}": {
          // override options here
        },
      },
    },

    // bind configuration
    bind: {
      options: bindOptions,
      // includes: nothing included in every bind right now
      sources: {
        /// @bindSources - THIS MUST FOLLOW job.bind.sources
        "{{{name}}}": {
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
        /// @executeSources - THIS MUST FOLLOW job.execute.sources
        "{{{name}}}": {
          // override options here (options are PARM=)
          options: "'HELLO WORLD'",
          jclStatements: [
            "//SNAP     DD  SYSOUT=*",
            "//SYSPRINT DD  SYSOUT=*",
            "//SYSMDUMP DD  DUMMY",
            "//SNAP     DD  SYSOUT=*",
            "//IN       DD  *",
            "CAN YOU SEE ME",
            "CAN YOU SEE ALSO",
            "/*",
          ],
        },
      }
    },
  },

  convert: {
    assemble: {
      options: assemblyOptions,
      includes: assemblyMaclibs,
      sources: {
        DCBD: {
          // override options here
        },
        IHADCBE: {},
        IHAECB: {},
        JFCB: {},
      },
    },
  },

  deploy: {
    ftp: {
      options: [
        "cd 'PUBLIC.TEMPLATE.LOADLIB'",
        "mdelete *"
      ],
      target: "localhost",
      sources: {
        /// @deploySources - THIS MUST FOLLOW deploy.sources
        "{{{name}}}": {},
      }
    }
  },
}
