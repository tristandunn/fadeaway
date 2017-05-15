import React from "react";
import Settings from "../utilities/settings";
import SketchPreferences from "./preferences/sketch.jsx";

const AFTER_COMPLETION = [
  { name: "exitApplication", text: "Exit application" },
  { name: "copyToClipboard", text: "Copy link to clipboard" }
];

class Preferences extends React.Component {
  constructor() {
    super();

    this.state = Settings.get("preferences") || {};
  }

  render() {
    return (
      <section id="preferences">
        <aside />

        <section>
          <label>After Completion</label>

          {AFTER_COMPLETION.map((item) => {
            let name    = item.name,
                checked = this.state[name];

            return (
              <div key={name}>
                <input type="checkbox" checked={checked} onChange={this.toggle.bind(this, name)} /> {item.text}
              </div>
            );
          })}
        </section>

        <SketchPreferences />
      </section>
    );
  }

  toggle(name) {
    let state = this.state;

    state[name] = !state[name];

    this.setState(state);

    Settings.set("preferences", state);
  }
}

export default Preferences;
