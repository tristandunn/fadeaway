import React from "react";
import Settings from "../utilities/settings";

const Shell     = window.require("shell"),
      Remote    = window.require("remote"),
      Electron  = Remote.require("electron"),
      Clipboard = Electron.clipboard;

class Uploaded extends React.Component {
  constructor() {
    super();

    this.preferences = Settings.get("preferences") || {};
  }

  componentDidMount() {
    let preferences = this.preferences;

    if (preferences.copyToClipboard) {
      Clipboard.writeText(this.props.screenshot.html_url);
    }

    if (preferences.exitApplication) {
      Electron.app.quit();
    }
  }

  render() {
    return (
      <section id="uploaded">
        <header>
          <h1>Success!</h1>

          <p><a href="#" onClick={this.onClick.bind(this)}>View it on Dribbble</a> or get back to work.</p>
        </header>
      </section>
    );
  }

  onClick(event) {
    event.preventDefault();

    Shell.openExternal(this.props.screenshot.html_url);
  }
}

Uploaded.propTypes = {
  screenshot : React.PropTypes.shape({
    html_url : React.PropTypes.string.isRequired
  })
};

export default Uploaded;
