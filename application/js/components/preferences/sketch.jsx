import React from "react";

const Shell    = window.require("shell"),
      Remote   = window.require("remote"),
      File     = Remote.require("fs"),
      Electron = Remote.require("electron");

const HOME_PATH        = window.process.env.HOME,
      ROOT_PATH        = Electron.app.getAppPath(),
      PLUGIN_NAME      = "Fadeaway.sketchplugin",
      PLUGIN_PATH      = `${HOME_PATH}/Library/Application Support/com.bohemiancoding.sketch3/Plugins/${PLUGIN_NAME}`,
      CURRENT_PATH     = `${ROOT_PATH}.unpacked/plugins/${PLUGIN_NAME}`,
      APPLICATION_PATH = "/Applications/Sketch.app";

class Sketch extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.checkForApplication();
    this.checkForUpgrade();
  }

  render() {
    return (
      <section>
        <label>Sketch Plugin</label>

        {this.renderButton()}
        {this.renderWarning()}
      </section>
    );
  }

  renderButton() {
    let button,
        state = this.state;

    if (state.current) {
      return (
        <p className="installed">
          <span className="checkmark">
            <span className="stem" />
            <span className="kick" />
          </span>

          Plugin is installed.
        </p>
      );
    } else {
      let action = state.outdated ? "Upgrade" : "Install";

      return (
        <button onClick={this.install.bind(this)}>{action} Sketch Plugin</button>
      );
    }
  }

  renderWarning() {
    let state = this.state;

    if (state.current || !state.missing) {
      return null;
    }

    return (
      <p className="warning">Warning: Sketch may not be installed.</p>
    );
  }

  checkForApplication() {
    File.stat(APPLICATION_PATH, (error, stats) => {
      this.setState({
        missing : error || !stats.isDirectory()
      });
    });
  }

  checkForUpgrade() {
    this.determineVersion(CURRENT_PATH, (error, version) => {
      this.determineVersion(PLUGIN_PATH, (error, installed) => {
        let current = version === installed;

        this.setState({
          current  : current,
          outdated : version && installed && !current
        });
      });
    });
  }

  determineVersion(path, callback) {
    File.stat(path, (error, stats) => {
      if (error || !stats.isDirectory()) {
        callback(true);

        return;
      }

      File.readFile(`${path}/Contents/Sketch/manifest.json`, (error, data) => {
        if (error) {
          return callback(error);
        }

        try {
          let manifest = JSON.parse(data);

          return callback(null, manifest.version);
        } catch(error) {
          return callback(error);
        }
      });
    });
  }

  install() {
    if (this.state.current) {
      return;
    }

    Shell.openItem(CURRENT_PATH);

    this.setState({
      current : true
    });
  }
}

export default Sketch;
