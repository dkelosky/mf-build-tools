#! /bin/env node

process.env.ALLOW_CONFIG_MUTATIONS = "yes"; // bypass immutability, value doesn't matter

import * as config from "config";
import { getOutFile, render } from "./genjclutil";

const jclTemplatefile = `./templates/jcl/deploy.jcl`;
const jclOutFile = getOutFile(`./lib/jcl/deploy.jcl`);

render(jclTemplatefile, config, jclOutFile);
