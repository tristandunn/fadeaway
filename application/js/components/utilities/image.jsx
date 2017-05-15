import React from "react";
import Resizer from "../../utilities/resizer";

const RATIO         = Math.min(2, window.devicePixelRatio),
      STEPS         = 100,
      WIDTH         = 400,
      HEIGHT        = 300,
      SCREEN_WIDTH  = WIDTH  * RATIO,
      SCREEN_HEIGHT = HEIGHT * RATIO;

class Image extends React.Component {
  constructor(properties) {
    super(properties);

    this.state = {
      x     : 0,
      y     : 0,
      scale : 1
    };

    this.attributes = {
      canvas : {
        width       : SCREEN_WIDTH,
        height      : SCREEN_HEIGHT,
        onMouseDown : this.onMouseDown.bind(this)
      },
      input : {
        max          : 1,
        onChange     : this.onScale.bind(this),
        defaultValue : 1
      }
    };

    this.onMouseUp   = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    let image = document.createElement("img");

    image.setAttribute("src", this.props.path);
    image.addEventListener("load", () => {
      let width   = image.naturalWidth,
          height  = image.naturalHeight,
          minimum = Math.max(SCREEN_HEIGHT / height, SCREEN_WIDTH / width);

      this.attributes.input = Object.assign(this.attributes.input, {
        min   : minimum,
        step  : (1 - minimum) / STEPS,
        style : {
          display : (minimum === 1 ? "none" : "block")
        }
      });

      this.resizer = new Resizer(image);
      this.setState({
        image  : image,
        width  : width,
        height : height
      });
    });
  }

  componentDidUpdate() {
    let state   = this.state,
        context = this.refs.canvas.getContext("2d");

    if (!state.image) {
      return;
    }

    let scale  = state.scale,
        width  = Math.round(state.width * scale),
        height = Math.round(state.height * scale);

    this.resizer
      .resizeTo(width, height)
      .then((image) => {
        context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        context.drawImage(image, 0, 0, width, height, state.x, state.y, width, height);
      });
  }

  render() {
    let attributes = this.attributes;

    return (
      <div className="image">
        <div className="canvas">
          <canvas ref="canvas" {...attributes.canvas} />
        </div>

        <input name="scale" type="range" ref="scale" {...attributes.input} />
      </div>
    );
  }

  onScale() {
    this.setState({
      scale : this.refs.scale.value
    });
  }

  onMouseDown() {
    this.setState({
      mouseX   : null,
      mouseY   : null,
      dragging : true
    });

    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove(event) {
    let state = this.state;

    if (!state.dragging) {
      return;
    }

    let mouseX = event.clientX,
        mouseY = event.clientY;

    if (state.mouseX && state.mouseY) {
      state.x = state.x - ((state.mouseX - mouseX) * RATIO);
      state.y = state.y - ((state.mouseY - mouseY) * RATIO);
    }

    state.mouseX = mouseX;
    state.mouseY = mouseY;

    this.setState(state);
  }

  setState(state) {
    state = Object.assign(this.state, state);

    if (state.image) {
      state.x = Math.max(Math.min(0, state.x), -(state.width  * state.scale - SCREEN_WIDTH));
      state.y = Math.max(Math.min(0, state.y), -(state.height * state.scale - SCREEN_HEIGHT));
    }

    super.setState(state);
  }

  onMouseUp() {
    if (!this.state.dragging) {
      return;
    }

    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("mousemove", this.onMouseMove);

    this.setState({
      dragging : false
    });
  }
}

Image.propTypes = {
  path : React.PropTypes.string.isRequired
};

export default Image;
