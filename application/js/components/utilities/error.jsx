/* eslint-disable react/no-danger */

import React from "react";
import ReactDOM from "react-dom";
import SelectionComponent from "../selection.jsx";
import AuthenticateComponent from "../authenticate.jsx";

const Shell = window.require("shell");

class Error extends React.Component {
  render() {
    let button,
        props = this.props;

    if (props.connect) {
      button = this.renderConnect();
    } else if (props.restart) {
      button = this.renderRestart();
    }

    return (
      <section id="error">
        <header>
          <h1>{props.title}</h1>

          <p dangerouslySetInnerHTML={ { __html: props.message } } />

          {button}
        </header>

        <footer>
          <p>
            If this problem persists, e-mail <a onClick={this.onSupport.bind(this)}>hello@tristandunn.com</a>.
          </p>
        </footer>
      </section>
    );
  }

  renderConnect() {
    return (
      <button onClick={this.onConnect.bind(this)}>
        <object type="image/svg+xml" data="images/icons/dribbble.svg" />
        Connect with Dribbble
      </button>
    );
  }

  renderRestart() {
    return (
      <button onClick={this.onRestart.bind(this)}>
        {this.props.restart}
      </button>
    );
  }

  onSupport(event) {
    event.preventDefault();

    Shell.openExternal("mailto:hello@tristandunn.com");
  }

  onConnect() {
    let element   = ReactDOM.findDOMNode(this),
        container = document.getElementById("container");

    element.classList.add("hide");
    element.addEventListener("webkitTransitionEnd", () => {
      ReactDOM.render(<AuthenticateComponent />, container);
    });
  }

  onRestart() {
    let container = document.getElementById("container");

    ReactDOM.render(<SelectionComponent />, container);
  }
}

Error.propTypes = {
  title   : React.PropTypes.string.isRequired,
  connect : React.PropTypes.bool,
  restart : React.PropTypes.string,
  message : React.PropTypes.string.isRequired
};

export default Error;
