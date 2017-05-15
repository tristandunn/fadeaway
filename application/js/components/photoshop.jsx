import React from "react";
import ReactDOM from "react-dom";
import UploadComponent from "./upload.jsx";
import ProgressComponent from "./utilities/progress.jsx";

const IPC = window.require("electron").ipcRenderer;

class Photoshop extends React.Component {
  componentDidMount() {
    IPC.send("psd", this.props.path);
    IPC.once("psd", (event, path) => {
      let container = document.getElementById("container");

      ReactDOM.render(<UploadComponent path={path} />, container);
    });
  }

  render() {
    return (
      <ProgressComponent message="Rendering the PSD" infinite={true} />
    );
  }
}

Photoshop.propTypes = {
  path : React.PropTypes.string.isRequired
};

export default Photoshop;
