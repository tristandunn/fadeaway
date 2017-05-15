import React from "react";
import ReactDOM from "react-dom";
import AuthenticateComponent from "./authenticate.jsx";

class Welcome extends React.Component {
  render() {
    return (
      <section id="welcome">
        <header>
          <h1>Welcome to {document.title}</h1>

          <p>
            Quick and easy uploading from your desktop and third-party
            applications to Dribbble. Connect to get started.
          </p>

          <button onClick={this.onClick.bind(this)}>
            <object type="image/svg+xml" data="images/icons/dribbble.svg" />
            Connect with Dribbble
          </button>
        </header>

        <footer>
          <p>
            You may revoke the authentication at any time.<br />The application will
            never upload unless you ask it to.
          </p>
        </footer>
      </section>
    );
  }

  onClick() {
    let element   = ReactDOM.findDOMNode(this),
        container = document.getElementById("container");

    element.classList.add("hide");
    element.addEventListener("webkitTransitionEnd", () => {
      ReactDOM.render(<AuthenticateComponent />, container);
    });
  }
}

export default Welcome;
