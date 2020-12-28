#! /bin/env node

/**
 * Use to upload all source or a subset of it
 *
 * Examples:
 *  npm run upload
 *  npm run upload -- --services asmpgm
 *  npm run upload -- --services asmpgm,asmmac/#entry,asmmac/#exit
 *  npm run upload -- --tests asmpgm
 */

import * as cmd from "commander";
import * as config from "config";
import { exec } from "child_process";
import { readdirSync, existsSync, writeFileSync, mkdirSync, appendFileSync, readFileSync } from "fs";
import { basename, extname, dirname } from "path";
import { setTimeout } from "timers"
import { promisify } from "util";
import { Uploads } from "./doc/IUploads";

// get config
const hlq: string = config.get<string>('settings.hlq');
const uploads: Uploads = config.get<Uploads>('uploads');

cmd.option("-s, --services [items]", "comma separated list");
cmd.option("-t, --tests [items]", "comma separated list");
cmd.option("-f, --failed", "repeat failed uploads");
cmd.parse(process.argv);

const MAX_SIMULTANEOUS_UPLOAD = 20;
const MIN_WAIT = 5000; // 5 seconds
const commands: string[] = [];
const OUTPUT_DIR = "./output";
const UPLOADS_DIR = OUTPUT_DIR + "/" + "uploads";
const REPORT_FILE = UPLOADS_DIR + "/" + "report.log";

// Make sure output directories exist
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR);
}

// Make sure output directories exist
if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR);
}

let oldReport = "";
try {
    oldReport = readFileSync(REPORT_FILE).toString();
} catch (e) {
    // do nothing
}

writeFileSync(REPORT_FILE, "");

let uploaded = false;

if (cmd.failed === true) {
    uploaded = true;
    uploadFailures(oldReport);
}

if (cmd.tests != undefined) {
    uploaded = true;
    commonUpload(cmd.tests, `./__tests__/zossrc/`);
}

if (cmd.services != undefined) {
    uploaded = true;
    commonUpload(cmd.services, `./zossrc/`);
}

if (!uploaded) {
    Object.keys(uploads).forEach((key) => {
        uploadFolder(key, undefined, `./__tests__/zossrc/`);
    });

    Object.keys(uploads).forEach((key) => {
        uploadFolder(key);
    });
}

function uploadFailures(old: string) {
    if (old === "") {
        console.log("Failure report does not exist.  Use `npm run uploads` first.")
        return;
    }

    const lines = old.split('\n');
    lines.forEach((line) => {
        const index = line.indexOf('[ERROR] ');
        if (index > -1) {
            const cmd = line.substr('[ERROR] '.length, line.length - '[ERROR] '.length)
            commands.push(cmd)
        }

    })
}


/**
 * Common logic to upload files
 * @param {string[]} entries
 */
function commonUpload(key: any, root: string) {

    if (key !== true) {

        const entries: string[] = key.split(',');
        entries.forEach((e) => {
            if (e) {
                if (dirname(e) === ".") {
                    uploadFolder(e, undefined, root);
                } else {
                    uploadFolder(dirname(e), basename(e), root);
                }
            }
        })
    }

    else {
        Object.keys(uploads).forEach((key) => {
            uploadFolder(key, undefined, root);
        });
    }

}

runCommands();

/**
 * Upload a local folder to z/OS
 * @param {string} folder - folder name
 * @param {string} [file] - option file within the folder
 */
function uploadFolder(folder: string, file?: string, root = `./zossrc/`) {
    const dir = `${root}${folder}`;

    // make sure file exists
    if (existsSync(dir)) {

        // upload a specific file
        if (file) {
            const fileWOutExtension = basename(file, extname(file));
            addUploadCommnad(`${dir}/${file}`, `${hlq}.${uploads[folder]}(${fileWOutExtension})`);

            // upload all files in a folder
        } else {
            const files = readdirSync(dir);
            files.forEach((file) => {
                const fileWOutExtension = basename(file, extname(file));
                if (fileWOutExtension !== `.gitkeep`) {
                    addUploadCommnad(`${dir}/${file}`, `${hlq}.${uploads[folder]}(${fileWOutExtension})`);
                }
            });
        }
    } else {
        console.error(`[WARN] ${dir} does not exist; skipping this directory upload`);
    }
}

/**
 * Add a zowe files upload command
 * @param {string} localFile - local file source
 * @param {string} dataSet - data set target
 */
function addUploadCommnad(localFile: string, dataSet: string) {
    const cmd = `zowe files upload ftds "${localFile}" "${dataSet}"`;
    commands.push(cmd);
}

async function runCommands() {

    const subsetCommands: string[][] = [];
    const pTimeout = promisify(setTimeout);

    // split all commands into smaller arrays
    for (let i = 0; i < commands.length; i += MAX_SIMULTANEOUS_UPLOAD) {
        subsetCommands.push(commands.slice(i, i + MAX_SIMULTANEOUS_UPLOAD));
    }

    for (let i = 0; i < subsetCommands.length; i++) {
        subsetCommands[i].forEach((entry) => {
            issueUploadCommnad(entry);
        })
        await pTimeout(MIN_WAIT)
    }

}

/**
 * Issue a zowe files upload command
 * @param {string} localFile - local file source
 * @param {string} dataSet - data set target
 */
function issueUploadCommnad(cmd: string) {
    exec(cmd + ` --rfj`, (err, stdout, stderr) => {
        if (err) {
            // console.log(err)
        }
        if (stdout) {
            const resp = JSON.parse(stdout.toString());
            if (resp.success) {
                console.log("[INFO] " + cmd);
                appendFileSync(REPORT_FILE, "[INFO] " + cmd + `\n  >> `);
                appendFileSync(REPORT_FILE, resp.data.apiResponse[0].to + " " + resp.data.commandResponse + "\n")
            } else {
                console.log("[ERROR] " + cmd);
                appendFileSync(REPORT_FILE, "[ERROR] " + cmd + `\n  >> `);
                if (resp.error.msg.indexOf("\n") > -1) {
                    let form = resp.error.msg.split(`\n`)
                    form.pop();
                    if (form[form.length - 1] === "") {
                        form.pop();
                    }
                    appendFileSync(REPORT_FILE, form.join(`\n  >> `) + "\n")
                }
                else {
                    appendFileSync(REPORT_FILE, resp.error.msg + "\n")
                }
                if (resp.error.additionalDetails) {
                    appendFileSync(REPORT_FILE, `  >> ` + resp.error.additionalDetails + "\n")
                };
                console.log(`>> see '${REPORT_FILE}' for more information`)
            }
        }
        if (stderr) {
            console.log(stderr.toString());
        }
    });
}
