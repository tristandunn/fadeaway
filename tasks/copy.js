import fs from "fs";
import gulp from "gulp";
import path from "path";

const sources = [
  "application/images/**/*",
  "application/js/ipc/**/*",
  "application/index.js",
  "application/index.html",
  "application/preferences.html",
  "application/updater.html",

  "!application/images/damage.png",
  "!application/images/damage@2x.png"
];

gulp.task("copy", ["copy:sketch"], () => {
  return gulp.src(sources, { base: "application" })
    .pipe(gulp.dest("build"));
});

gulp.task("copy:sketch", () => {
  let base  = path.resolve("../sketch/build"),
      files = fs.readdirSync(base);

  if (!files || files.length === 0) {
    throw `Sketch plug-in missing, in '${base}'`;
  }

  base = path.resolve(base, files.shift());

  gulp.src(path.resolve(base, "Contents", "**", "*"), { base: base, recursive: true })
    .pipe(gulp.dest("build/plugins/Fadeaway.sketchplugin"));
});
