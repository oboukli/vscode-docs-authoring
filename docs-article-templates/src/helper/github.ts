"use-strict";

import * as fs from "fs";
import os = require("os");
import * as path from "path";
import { output } from "../extension";
import * as common from "./common";

export const docsAuthoringDirectory = path.join(os.homedir(), "Docs Authoring");
export const templateDirectory = path.join(docsAuthoringDirectory, "templates");

// download a copy of the template repo to the "docs authoring" directory.  no .git-related files will be generated by this process.
export async function downloadRepo() {
    const download = require("download-git-repo");
    const templateRepo = "MicrosoftDocs/content-templates";
    download(templateRepo, docsAuthoringDirectory, (err) => {
        if (err) {
            common.postWarning(err ? "Error: Cannot connect to " + templateRepo : "Success");
            output.appendLine(err ? "Error: Cannot connect to " + templateRepo : "Success");
        }
    });
}

// the download process is on a repo-level so this function will be used to delete any files pulled down by the download process.
export async function cleanupDownloadFiles(templates?: boolean) {
    let workingDirectory: string;

    if (templates) {
        workingDirectory = templateDirectory;
    } else {
        workingDirectory = docsAuthoringDirectory;
    }

    fs.readdir(workingDirectory, (err, files) => {
        files.forEach((file) => {
            const fullFilePath = path.join(workingDirectory, file);
            fs.stat(path.join(fullFilePath), (error, stats) => {
                if (stats.isFile()) {
                    fs.unlinkSync(fullFilePath);
                }
                if (error) {
                    output.appendLine("Error: " + error);
                }
            });
        });
    });
}
