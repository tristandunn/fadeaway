/* global __dirname,module,require */
/* eslint strict: 0 */

"use strict";

const BrowserWindow = require("browser-window");

let window = null;

class Preferences {
  static create() {
    window = new BrowserWindow({
      "width"       : 448,
      "height"      : 168,
      "center"      : true,
      "resizable"   : false,
      "fullscreen"  : false,
      "maximizable" : false,
      "minimizable" : false,
      "skipTaskbar" : true
    });

    window.on("closed", () => {
      window = null;
    });

    window.loadURL(`file://${__dirname}/../../preferences.html`);
  }

  static show() {
    if (!window) {
      this.create();
    }

    window.show();
  }
}

module.exports = Preferences;
