/* global module,process,require */
/* eslint strict: 0 */

"use strict";

const Application = require("app"),
      File        = require("fs"),
      IPC         = require("electron").ipcMain,
      Defaults    = {
        "local" : {
          "host"      : "http://localhost:3000",
          "client_id" : ""
        },

        "production" : {
          "host"      : "http://getfadeaway.com",
          "client_id" : ""
        }
      }[process.env.ELECTRON_ENV || "production"];

let data,
    argv = process.argv,
    file = argv.length > 1 && argv[argv.length - 1],
    path = `${Application.getPath("userData")}/settings.json`;

try {
  data = JSON.parse(File.readFileSync(path));
} catch(exception) {
  data = {};
}

if (file) {
  File.lstat(file, (err, stats) => {
    if (!err && stats.isFile()) {
      Defaults.arguments = { path: file };
    }
  });
}

class Settings {
  static get(key) {
    return data[key] || Defaults[key] || false;
  }

  static set(key, value) {
    data[key] = value;

    File.writeFileSync(path, JSON.stringify(data));
  }
}

IPC.on("setting:get", (event, key) => {
  event.returnValue = Settings.get(key);
});

IPC.on("setting:set", (event, key, value) => {
  Settings.set(key, value);

  event.returnValue = true;
});

module.exports = Settings;
