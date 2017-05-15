/* global process */

import gulp from "gulp";
import shell from "gulp-shell";
import electron from "electron-prebuilt";
import sequence from "run-sequence";

gulp.task("electron", () => {
  return gulp.src("", { read: false })
    .pipe(shell(`${electron} build`));
});

gulp.task("run", () => {
  process.env.ELECTRON_ENV = "local";

  return sequence.use(gulp)(
    "clean",
    "copy",
    "install",
    ["javascript", "stylesheet"],
    "electron"
  );
});
