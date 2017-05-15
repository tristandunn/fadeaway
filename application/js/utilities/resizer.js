class Resizer {
  constructor(image) {
    let canvas  = document.createElement("canvas"),
        context = canvas.getContext("2d");

    context.imageSmoothingEnabled = true;

    this.image   = image;
    this.canvas  = canvas;
    this.context = context;
  }

  halve(image, callback) {
    let canvas = this.canvas,
        width  = Math.max(canvas.width  / 2, this.width),
        height = Math.max(canvas.height / 2, this.height);

    canvas.width  = width;
    canvas.height = height;

    this.context.drawImage(image, 0, 0, width, height);

    callback();
  }

  resizeTo(width, height) {
    this.width  = width;
    this.height = height;

    return new Promise((resolve) => {
      let canvas   = this.canvas,
          callback = () => {
            if (canvas.width <= width || canvas.height <= height) {
              resolve(canvas);
            } else {
              this.halve(canvas, callback);
            }
          };

      this.halve(this.image, callback);
    });
  }
}

export default Resizer;
