import React from "react";
import ReactDOM from "react-dom";
import SketchComponent from "./sketch.jsx";
import UploadComponent from "./upload.jsx";
import PhotoshopComponent from "./photoshop.jsx";

const TYPE_MATCHER   = /^image\/(gif|jpeg|png|vnd\.adobe\.photoshop)$/i,
      SKETCH_MATCHER = /.+\.sketch$/;

class Selection extends React.Component {
  constructor(properties) {
    super(properties);

    this.state = {
      "active" : false,
      "count"  : 0
    };
  }

  render() {
    let className = this.state.active ? "active" : null;

    return (
      <section id="selection" className={className}
          onDragEnter={this.onDragEnter.bind(this)} onDragOver={this.onDragOver.bind(this)}
          onDragLeave={this.onDragLeave.bind(this)} onDrop={this.onDrop.bind(this)}>
        <div>
          <h1>
            Drag an image here or <label htmlFor="file">select one</label>.
          </h1>

          <input type="file" id="file" onChange={this.onChange.bind(this)} />

          <p>
            Must be a <strong>GIF</strong>, <strong>JPG</strong>, <strong>PNG</strong>, <strong>PSD</strong>, or <strong>Sketch</strong> file.
          </p>
        </div>
      </section>
    );
  }

  getEventFile(files) {
    let file = files[0];

    if (file && (file.type.match(TYPE_MATCHER) || file.name.match(SKETCH_MATCHER))) {
      return file;
    }

    return null;
  }

  onChange(event) {
    let file = this.getEventFile(event.target.files);

    if (file) {
      this.select(file);
    } else {
      this.showError();
    }

    event.preventDefault();
  }

  onDragEnter(event) {
    let file = this.getEventFile(event.dataTransfer.files);

    this.setState({
      "active" : !!file,
      "count"  : ++this.state.count
    });

    event.preventDefault();
  }

  onDragLeave(event) {
    this.setState({
      "count" : --this.state.count
    });

    if (this.state.count === 0) {
      this.setState({
        "active" : false
      });
    }

    event.preventDefault();
  }

  onDragOver(event) {
    event.preventDefault();
  }

  onDrop(event) {
    let file = this.getEventFile(event.dataTransfer.files);

    if (file) {
      this.select(file);
    } else {
      this.showError();
      this.setState({
        "active" : false,
        "count"  : 0
      });
    }

    event.preventDefault();
  }

  select(file) {
    let container = document.getElementById("container");

    if (file.type === "image/vnd.adobe.photoshop") {
      ReactDOM.render(<PhotoshopComponent path={file.path} />, container);
    } else if (file.name.match(SKETCH_MATCHER)) {
      ReactDOM.render(<SketchComponent path={file.path} />, container);
    } else {
      ReactDOM.render(<UploadComponent path={file.path} />, container);
    }
  }

  showError() {
    let element = ReactDOM.findDOMNode(this);

    element.classList.add("error");
    element.addEventListener("webkitTransitionEnd", () => {
      element.classList.remove("error");
    });
  }
}

Selection.propTypes = {
  "active" : React.PropTypes.bool,
  "count"  : React.PropTypes.number
};

export default Selection;
