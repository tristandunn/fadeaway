/* global __dirname,require */
/* eslint strict: 0 */

"use strict";

const File = require("fs"),
      IPC  = require("electron").ipcMain;

IPC.on("file", (event, path) => {
  event.returnValue = File
    .readFileSync(`${__dirname}/../../${path}`)
    .toString();
});
