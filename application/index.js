"use strict";

const Application   = require("app"),
      BrowserWindow = require("browser-window"),
      CrashReporter = require("electron").crashReporter,
      OS            = require("os"),
      Settings      = require("./js/ipc/settings");

let window = null;

CrashReporter.start({
  "companyName"    : Application.getName(),
  "productionName" : Application.getName(),
  "submitURL"      : Settings.get("host") + "/crashes",
  "extra"          : {
    "access_token" : Settings.get("token"),
    "memory_free"  : OS.freemem().toString(),
    "memory_total" : OS.totalmem().toString(),
    "os_arch"      : OS.arch(),
    "os_release"   : OS.release()
  }
});

Application.on("ready", () => {
  window = new BrowserWindow({
    "width"      : 896,
    "height"     : 512,
    "resizable"  : false,
    "fullscreen" : false
  });

  try {
    require("browser-sync")
      .create()
      .watch(`${__dirname}/**/*`, (event, file) => {
        if (event === "change" && file.match(/(.css|.html|.js)$/g)) {
          BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.reloadIgnoringCache();
          });
        }
      });
  } catch(exception) {}

  window.webContents.on("will-navigate", (event, url) => {
    event.preventDefault();
  });

  window.on("closed", () => {
    window = null;
  });

  window.loadURL(`file://${__dirname}/index.html`);

  require("./js/ipc/file");
  require("./js/ipc/menu");
  require("./js/ipc/psd");
  require("./js/ipc/updater");
});

Application.on("window-all-closed", Application.quit);
