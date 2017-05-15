/* global __dirname */

import gulp from "gulp";
import shell from "gulp-shell";
import eslint from "gulp-eslint";
import sequence from "run-sequence";

const sources = [
  "gulpfile.babel.js",
  "application/js/**/*.{js,jsx}",
  "tasks/**/*.js"
];

gulp.task("lint:javascript", () => {
  return gulp.src(sources)
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task("lint:stylesheets", () => {
  return gulp.src("", { read: false })
    .pipe(shell(`scss-lint --config ${__dirname}/../.scss-lint.yml --color`, {
      ignoreErrors : true
    }));
});

gulp.task("lint", (callback) => {
  return sequence.use(gulp)(
    "lint:javascript",
    "lint:stylesheets",
    callback
  );
});
