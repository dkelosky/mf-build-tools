import bindOptions from "./imports/bind/bindOptions";
import dataSets from "./imports/dataSets";
import uploads from "./imports/uploads";
import assemblyOptions from "./imports/assembly/assemblyOptions";
import assemblyMaclibs from "./imports/assembly/assemblyMaclibs";
import metalOptions64 from "./imports/metal/metalOptions64";
import metalIncludes from "./imports/metal/metalIncludes";

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

    // metal c compilation configuration
    compile: {
      options: metalOptions64,
      includes: metalIncludes,
      sources: {
        /// @compileSources - THIS MUST FOLLOW job.compile.sources
      },
    },

    // assemble configuration
    assemble: {
      options: assemblyOptions,
      includes: assemblyMaclibs,
      sources: {

        // each source can have it's own `options: [ ... ]`

        /// @assembleSources - THIS MUST FOLLOW job.assemble.sources
      },
    },

    // bind configuration
    bind: {
      options: bindOptions,
      // includes: nothing included in every bind right now
      sources: {

        // each source can have it's one `includes: [ ... ]` or `objects: [ ... ]`

        /// @bindSources - THIS MUST FOLLOW job.bind.sources
      }
    },

    // executables
    execute: {
      // options: no parms to every exec right now (options are PARM=)
      sources: {

        /**
         * Add JCL PARM via:
         *   options: "'HELLO WORLD'",
         *
         * Add arbitrary JCL statements via:
         *  jclStatements: [
         *    "//SNAP     DD  SYSOUT=*",
         *    "//SYSPRINT DD  SYSOUT=*",
         *    "//SYSMDUMP DD  DUMMY",
         *    "//SNAP     DD  SYSOUT=*",
         *    "//IN       DD  *",
         *    "CAN YOU SEE ME",
         *    "CAN YOU SEE ALSO",
         *    "/*",
         *  ],
         */

        /// @executeSources - THIS MUST FOLLOW job.execute.sources
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
        "user",
        "password",
        "binary",
        "cd 'PUBLIC.TEMPLATE.LOADLIB'",
        // "mdelete *"
      ],
      target: "localhost",
      sources: {
        /// @deploySources - THIS MUST FOLLOW deploy.sources
      }
    }
  },
}
