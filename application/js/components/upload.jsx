import React from "react";
import ReactDOM from "react-dom";
import Settings from "../utilities/settings";
import ImageComponent from "./utilities/image.jsx";
import UploadingComponent from "./uploading.jsx";
import "../vendor/canvas-to-blob";

class Upload extends React.Component {
  render() {
    return (
      <section id="upload">
        <ImageComponent path={this.props.path} />

        <form>
          <input type="text" name="title" placeholder="Title" ref="title" />
          <input type="text" name="tags" placeholder="Tags" />
          <textarea name="description" placeholder="Description" onChange={this.onDescriptionChange.bind(this)} onFocus={this.onDescriptionChange.bind(this)} />

          <button onClick={this.onClick.bind(this)}>Post to Dribbble</button>
        </form>
      </section>
    );
  }

  valid() {
    let element = this.refs.title,
        title   = element.value.trim();

    element.classList.remove("error");

    if (title === "") {
      element.focus();
      element.value = "";
      element.classList.add("error");

      return false;
    }

    return true;
  }

  onClick(event) {
    event.preventDefault();

    if (!this.valid()) {
      return;
    }

    let request   = new XMLHttpRequest(),
        element   = ReactDOM.findDOMNode(this),
        form      = new FormData(element.querySelector("form")),
        canvas    = element.querySelector("canvas"),
        container = document.getElementById("container");

    canvas.toBlob((image) => {
      form.append("image",        image);
      form.append("access_token", Settings.get("token"));

      ReactDOM.render(<UploadingComponent request={request} />, container);

      request.open("POST", "https://api.dribbble.com/v1/shots");
      request.send(form);
    }, "image/png");
  }

  onDescriptionChange(event) {
    let element = event.target;

    if (element.value.trim() === "") {
      element.value = "";
      element.setAttribute("placeholder", "Description");
    } else {
      element.removeAttribute("placeholder");
    }
  }
}

Upload.propTypes = {
  path : React.PropTypes.string.isRequired
};

export default Upload;
