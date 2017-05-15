/* global __dirname */

import gulp from "gulp";
import shell from "gulp-shell";

gulp.task("sign", () => {
  let path = `${__dirname}/../release/Fadeaway-darwin-x64/Fadeaway.app`;

  return gulp.src("", { read: false })
    .pipe(shell(`codesign --deep --force --verbose --sign "Tristan Dunn" ${path}`));
});
