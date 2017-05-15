/* global __dirname,process,require */
/* eslint strict: 0 */

"use strict";

const Badger        = require("honeybadger"),
      BrowserWindow = require("browser-window"),
      Electron      = require("electron"),
      IPC           = Electron.ipcMain,
      OS            = require("os"),
      Settings      = require("./settings"),
      Shell         = Electron.shell,
      Updater       = Electron.autoUpdater;

let window = null;

Updater.on("update-downloaded", (event, notes, name) => {
  window = new BrowserWindow({
    "show"        : false,
    "width"       : 560,
    "height"      : 400,
    "center"      : true,
    "resizable"   : false,
    "fullscreen"  : false,
    "maximizable" : false,
    "minimizable" : false,
    "skipTaskbar" : true
  });

  window.on("blur", () => {
    let focused = BrowserWindow.getFocusedWindow();

    if (focused && focused !== window) {
      window.focus();
    }
  });

  window.on("closed", () => {
    window = null;
  });

  window.webContents.on("dom-ready", () => {
    let details = { notes: notes, version: name },
        code    = "window.onUpdate(" + JSON.stringify(details) + ");";

    window.webContents.executeJavaScript(code);
    window.show();
  });

  window.webContents.on("will-navigate", (event, url) => {
    Shell.openExternal(url);

    event.preventDefault();
  });

  window.loadURL(`file://${__dirname}/../../updater.html`);
});

Updater.on("error", (error) => {
  Badger.configure({
    "apiKey"      : "",
    "hostname"    : Settings.get("host"),
    "environment" : process.env.ELECTRON_ENV || "production",

    "developmentEnvironments" : ["local"]
  });

  Badger.notify(error, {
    "context" : {
      "access_token" : Settings.get("token"),
      "os_arch"      : OS.arch(),
      "os_release"   : OS.release(),
      "project_root" : __dirname,
      "version"      : Electron.app.getVersion()
    }
  });
});

IPC.on("check-for-update", () => {
  let host    = Settings.get("host"),
      token   = Settings.get("token"),
      version = Electron.app.getVersion(),
      url     = `${host}/update/${version}?access_token=${token}`;

  Updater.setFeedURL(url);
  Updater.checkForUpdates();
});

IPC.on("ignore-update", () => {
  window.close();
});
