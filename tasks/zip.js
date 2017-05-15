/* global __dirname */

import gulp from "gulp";
import shell from "gulp-shell";
import packageJSON from "../package.json";

gulp.task("zip", () => {
  let source = `${__dirname}/../release/Fadeaway-darwin-x64`,
      target = `${packageJSON.name}-${packageJSON.version}.zip`;

  return gulp.src("", { read: false })
    .pipe(shell(
      `cd ${source} && zip -r -y ${target} Fadeaway.app && mv ${target} ../`,
      { quiet: true }
    ));
});
