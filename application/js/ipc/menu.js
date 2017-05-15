/* global require */

const Electron    = require("electron"),
      Menu        = require("menu"),
      Preferences = require("./preferences");

let name = Electron.app.getName();

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      "label"   : name,
      "submenu" : [
        { "label"    : `About ${name}`,
          "selector" : "orderFrontStandardAboutPanel:"
        }, {
          "type" : "separator"
        }, {
          "label"       : "Preferences…",
          "accelerator" : "Command+,",
          "click"       : () => {
            Preferences.show();
          }
        }, {
          "type" : "separator"
        }, {
          "role"    : "services",
          "label"   : "Services",
          "submenu" : []
        }, {
          "type" : "separator"
        }, {
          "role"        : "hide",
          "label"       : `Hide ${name}`,
          "accelerator" : "Command+H"
        }, {
          "role"        : "hideothers",
          "label"       : "Hide Others",
          "accelerator" : "Command+Alt+H"
        }, {
          "role"  : "unhide",
          "label" : "Show All"
        }, {
          "type" : "separator"
        }, {
          "label"       : "Quit",
          "accelerator" : "Command+Q",
          "click"       : () => {
            Electron.app.quit();
          }
        }
      ]
    }, {
      "label"   : "Edit",
      "submenu" : [
        { "role"        : "undo",
          "label"       : "Undo",
          "accelerator" : "Command+Z"
        }, {
          "role"        : "redo",
          "label"       : "Redo",
          "accelerator" : "Shift+Command+Z"
        }, {
          "type" : "separator"
        }, {
          "role"        : "cut",
          "label"       : "Cut",
          "accelerator" : "Command+X"
        }, {
          "role"        : "copy",
          "label"       : "Copy",
          "accelerator" : "Command+C"
        }, {
          "role"        : "paste",
          "label"       : "Paste",
          "accelerator" : "Command+V"
        }, {
          "role"        : "selectall",
          "label"       : "Select All",
          "accelerator" : "Command+A"
        }
      ]
    }, {
      "role"    : "window",
      "label"   : "Window",
      "submenu" : [
        { "role"        : "minimize",
          "label"       : "Minimize",
          "accelerator" : "CmdOrCtrl+M"
        }, {
          "role"        : "close",
          "label"       : "Close",
          "accelerator" : "CmdOrCtrl+W"
        }
      ]
    }, {
      "role"    : "help",
      "label"   : "Help",
      "submenu" : [
        { "label" : `${name} Website`,
          "click" : () => {
            Electron.shell.openExternal("https://getfadeaway.com");
          }
        }
      ]
    }
  ])
);
