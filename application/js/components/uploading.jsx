import React from "react";
import ReactDOM from "react-dom";
import Settings from "../utilities/settings";
import ErrorComponent from "./utilities/error.jsx";
import ProgressComponent from "./utilities/progress.jsx";
import UploadedComponent from "./uploaded.jsx";

const HTTP_OK           = 200,
      HTTP_UNAUTHORIZED = 401;

class Uploading extends React.Component {
  constructor(properties) {
    super(properties);

    this.state = {
      uploading  : true,
      percentage : 0
    };
  }

  componentDidMount() {
    let request = this.props.request;

    request.addEventListener("readystatechange", this.onStateChange.bind(this));
    request.upload.addEventListener("progress", this.onProgress.bind(this));
  }

  render() {
    let state   = this.state,
        message = state.uploading ? "Uploading to Dribbble" : "Processing on Dribbble";

    return (
      <ProgressComponent message={message} width={state.percentage} />
    );
  }

  onProgress(event) {
    if (!event.lengthComputable) {
      return;
    }

    let total      = 100,
        percentage = (event.loaded / event.total) * total;

    this.setState({
      percentage : percentage / 2
    });
  }

  onStateChange() {
    let ready   = 4,
        request = this.props.request;

    if (request.readyState !== ready) {
      return null;
    }

    if (request.status === HTTP_UNAUTHORIZED) {
      let title     = "Authentication Error",
          message   = "Your authentication token has been revoked or expired. " +
                        "You can connect again below.",
          container = document.getElementById("container");

      return ReactDOM.render(<ErrorComponent title={title} message={message} connect={true} />, container);
    }

    let delay    = 250,
        token    = Settings.get("token"),
        location = request.getResponseHeader("Location"),
        url      = `${location}?access_token=${token}`;

    return this.setState({
      url       : url,
      interval  : setInterval(this.checkProgress.bind(this), delay),
      uploading : false
    });
  }

  checkProgress() {
    let state      = this.state,
        check      = 10,
        maximum    = 100,
        increment  = 0.5,
        container  = document.getElementById("container"),
        percentage = state.percentage + increment;

    this.setState({
      percentage : percentage
    });

    if (percentage === maximum) {
      let title     = "Timeout Error",
          message   = "Looks like Dribbble is taking a while to process your upload. " +
                        "Check the website or try uploading again.",
          container = document.getElementById("container");

      clearInterval(state.interval);

      ReactDOM.render(<ErrorComponent title={title} message={message} restart="Try uploading again." />, container);

      return;
    } else if (percentage % check !== 0) {
      return;
    }

    fetch(state.url)
      .then((response) => {
        if (response.status !== HTTP_OK) {
          throw new Error();
        }

        return response.json();
      })
      .then((screenshot) => {
        clearInterval(state.interval);

        this.setState({
          interval   : null,
          percentage : 100
        });

        ReactDOM.render(<UploadedComponent screenshot={screenshot} />, container);
      })
      .catch(() => {
        return;
      });
  }
}

Uploading.propTypes = {
  request : React.PropTypes.object.isRequired
};

export default Uploading;
