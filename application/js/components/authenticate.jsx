import React from "react";
import ReactDOM from "react-dom";
import Settings from "../utilities/settings";
import ErrorComponent from "./utilities/error.jsx";
import SelectionComponent from "./selection.jsx";

const SCOPE            = "public+upload",
      CLIENT_ID        = Settings.get("client_id"),
      AUTHORIZE_URL    = `https://dribbble.com/oauth/authorize?scope=${SCOPE}&client_id=${CLIENT_ID}&state=desktop`,
      HTTP_OK          = 200,
      HTTP_UNAVAILABLE = 503;

class Authenticate extends React.Component {
  componentDidMount() {
    let element = ReactDOM.findDOMNode(this),
        overlay = this.overlay = element.querySelector(".overlay"),
        webview = this.webview = element.querySelector(".webview");

    overlay.classList.add("show");
    overlay.addEventListener("webkitTransitionEnd", () => {
      webview.style.display = "flex";
    });

    webview.addEventListener("dom-ready", this.onReady.bind(this));
    webview.addEventListener("did-get-redirect-request", this.onRedirect.bind(this));
  }

  render() {
    return (
      <section id="authenticate">
        <div className="overlay">
          <p>Loading&#8230;</p>
        </div>

        <webview className="webview" src={AUTHORIZE_URL} />
      </section>
    );
  }

  onReady() {
    let overlay    = this.overlay,
        webview    = this.webview,
        custom_css = window.require("electron").ipcRenderer.sendSync("file", "css/authenticate.css");

    webview.insertCSS(custom_css);

    if (!overlay) {
      return;
    }

    overlay.classList.remove("show");
    overlay.addEventListener("webkitTransitionEnd", () => {
      overlay.remove();
      webview.focus();
    });
  }

  onRedirect(event) {
    let matches = event.newURL.match(/\?code\=(.+)$/);

    if (!matches) {
      return;
    }

    let code      = matches[1],
        host      = Settings.get("host"),
        url       = `${host}/tokens?code=${code}`,
        container = document.getElementById("container"),
        options   = {
          "method" : "POST"
        };

    fetch(url, options)
      .then((response) => {
        if (response.status === HTTP_OK) {
          return response.text();
        } else if (response.status === HTTP_UNAVAILABLE) {
          throw {};
        }

        throw {
          title   : "Authentication Error",
          message : "There was an error while attempting to authenticate " +
                      "with the Dribbble API. You can try to connecting " +
                      "again below."
        };
      })
      .then((token) => {
        ReactDOM.render(<SelectionComponent />, container);

        Settings.set("token", token);
      })
      .catch(this.renderError);
  }

  renderError(error) {
    let title     = error.title,
        message   = error.message,
        container = document.getElementById("container");

    if (!message || message === "Failed to fetch") {
      title   = "Server Unavailable";
      message = "The server is offline for maintenance.<br>" +
                  "Please try connecting again shortly.";
    }

    ReactDOM.render(<ErrorComponent title={title} message={message} connect={true} />, container);
  }
}

export default Authenticate;
