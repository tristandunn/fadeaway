/* global process,require */

const PSD  = require("psd"),
      Temp = require("temp");

process.on("message", (data) => {
  let path = Temp.path({ suffix: ".png" });

  PSD.open(data.path).then((psd) => {
    return psd.image.saveAsPng(path);
  }).then(() => {
    process.send({ path: path });
    process.disconnect();
    process.exit();
  });
});
