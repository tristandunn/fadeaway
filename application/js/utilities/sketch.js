const Remote  = window.require("remote"),
      Process = Remote.require("child_process"),
      Temp    = window.require("temp"),
      Tool    = "/Applications/Sketch.app/Contents/Resources/sketchtool/bin/sketchtool";

const BASE           = 10,
      DELIMETER      = "@",
      PREFIX_MATCHER = /Exported\s+/g;

class Sketch {
  static export(path, id, callback) {
    let directory = Temp.mkdirSync(),
        command   = `${Tool} export artboards "${path}" --item="${id}" --output="${directory}"`;

    Process.exec(command, (error, output) => {
      if (error) {
        callback(error);

        return;
      }

      let filename = output
        .trim()
        .replace(PREFIX_MATCHER, "")
        .split("\n")
        .sort((a, b) => {
          return (parseFloat(a.split(DELIMETER)[1], BASE) || 1) -
                   (parseFloat(b.split(DELIMETER)[1], BASE) || 1);
        })
        .pop();

      callback(null, `${directory}/${filename}`);
    });
  }

  static parse(path, callback) {
    let command = `${Tool} list artboards "${path}"`;

    Process.exec(command, (error, output) => {
      if (error) {
        callback(error);

        return;
      }

      let data      = JSON.parse(output),
          artboards = [];

      data.pages.forEach((page) => {
        page.artboards.forEach((artboard) => {
          artboards.push({
            id   : artboard.id,
            name : artboard.name
          });
        });
      });

      artboards = artboards.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

      callback(null, artboards);
    });
  }
}

export default Sketch;
