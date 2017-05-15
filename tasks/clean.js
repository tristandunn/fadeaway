import del from "del";
import gulp from "gulp";

const sources = [
  "build",
  "release"
];

gulp.task("clean", () => {
  return del(sources);
});
