/* eslint-disable react/no-danger */

import React from "react";

const Remote   = window.require("remote"),
      Electron = Remote.require("electron"),
      IPC      = window.require("electron").ipcRenderer;

class Updater extends React.Component {
  render() {
    let name    = Electron.app.getName(),
        props   = this.props,
        version = Electron.app.getVersion();

    return (
      <section id="updater">
        <header>
          <img src="images/icon.png" width="64" height="64" />

          <h1>A new version of {name} is available!</h1>

          <p>
            {name} {props.version} is available. You are using {version} currently.<br />
            Would you like to install the new version now?
          </p>
        </header>

        <section>
          <button onClick={this.install}>Install Now</button>
          <button onClick={this.ignore}>Install Later</button>
        </section>

        <aside dangerouslySetInnerHTML={ { __html: props.notes } } />
      </section>
    );
  }

  ignore(event) {
    IPC.send("ignore-update");

    event.preventDefault();
  }

  install(event) {
    Electron.autoUpdater.quitAndInstall();

    event.preventDefault();
  }
}

Updater.propTypes = {
  notes   : React.PropTypes.string.isRequired,
  version : React.PropTypes.string.isRequired
};

export default Updater;
