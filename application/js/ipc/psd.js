/* global __dirname,require */
/* eslint strict: 0 */

"use strict";

const ChildProcess = require("child_process"),
      IPC          = require("electron").ipcMain;

IPC.on("psd", (event, path) => {
  const fork = ChildProcess.fork(`${__dirname}/psd/runner.js`);

  fork.on("message", (data) => {
    event.sender.send("psd", data.path);
  });

  fork.send({ path: path });
});
