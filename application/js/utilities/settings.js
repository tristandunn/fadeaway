const IPC = window.require("electron").ipcRenderer;

class Settings {
  static get(key) {
    return IPC.sendSync("setting:get", key);
  }

  static set(key, value) {
    IPC.sendSync("setting:set", key, value);
  }
}

export default Settings;
