import React from "react";
import ReactDOM from "react-dom";
import Tool from "../utilities/sketch";
import ErrorComponent from "./utilities/error.jsx";
import UploadComponent from "./upload.jsx";
import ProgressComponent from "./utilities/progress.jsx";

const MAXIMUM_SIZE = 5;

class Sketch extends React.Component {
  constructor() {
    super();

    this.state = {
      parsing   : true,
      selected  : false,
      importing : false
    };
  }

  componentDidMount() {
    let path = this.props.path;

    Tool.parse(path, (error, artboards) => {
      if (error) {
        let title     = "Sketch parsing error.",
            message   = "There was a problem parsing the Sketch file. " +
                          "Please ensure it's a valid Sketch file and " +
                          "try again.",
            container = document.getElementById("container");

        ReactDOM.render(<ErrorComponent title={title} message={message} restart="Try parsing again." />, container);
      } else if (artboards.length === 1) {
        this.importArtboard(artboards[0].id);
      } else {
        this.setState({
          parsing   : false,
          artboards : artboards
        });
      }
    });
  }

  render() {
    let state = this.state;

    if (state.parsing) {
      return (
        <ProgressComponent message="Parsing the Sketch file" infinite={true} />
      );
    } else if (state.importing) {
      return (
        <ProgressComponent message="Importing the Sketch artboard" infinite={true} />
      );
    }

    return (
      <section id="sketch">
        <header>
          <h1>Select an artboard to import:</h1>
        </header>

        {this.renderSelect()}
        {this.renderButton()}
      </section>
    );
  }

  renderButton() {
    let className = this.state.selected ? "active" : "";

    return (
      <button className={className} onClick={this.onImport.bind(this)}>Import Artboard</button>
    );
  }

  renderSelect() {
    let artboards = this.state.artboards,
        size      = Math.min(MAXIMUM_SIZE, artboards.length);

    return (
      <select size={size} ref="select">
        {artboards.map((artboard) => {
          return (
            <option onClick={this.onSelect.bind(this)} value={artboard.id} key={artboard.id}>
              {artboard.name}
            </option>
          );
        })}
      </select>
    );
  }

  onImport() {
    let element = this.refs.select,
        id      = element.value;

    if (id) {
      this.importArtboard(id);
    }
  }

  onSelect() {
    this.setState({
      selected : true
    });
  }

  importArtboard(id) {
    let container = document.getElementById("container");

    this.setState({
      importing : true
    });

    Tool.export(this.props.path, id, (error, path) => {
      if (error) {
        let title   = "Sketch importing error.",
            message = "There was a problem importing the Sketch artboard. " +
                        "Please ensure the artboard still exists and " +
                        "try again.";

        ReactDOM.render(<ErrorComponent title={title} message={message} restart="Try importing again." />, container);
      } else {
        ReactDOM.render(<UploadComponent path={path} />, container);
      }
    });
  }
}

Sketch.propTypes = {
  path : React.PropTypes.string.isRequired
};

export default Sketch;
