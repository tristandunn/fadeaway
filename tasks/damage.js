/* global __dirname */

import gulp from "gulp";
import damage from "appdmg";
import packageJSON from "../package.json";

gulp.task("damage", (callback) => {
  let processor = damage({
    "target"        : `release/${packageJSON.name}-${packageJSON.version}.dmg`,
    "basepath"      : `${__dirname}/../`,
    "specification" : {
      "title"      : packageJSON.name,
      "icon"       : "application/images/icon.icns",
      "icon-size"  : 80,
      "background" : "application/images/damage.png",
      "contents"   : [
        { "x": 481, "y": 247, "type": "link", "path": "/Applications" },
        { "x": 160, "y": 247, "type": "file", "path": "release/Fadeaway-darwin-x64/Fadeaway.app" }
      ]
    }
  });

  processor.on("error", callback);
  processor.on("finish", callback);
});
