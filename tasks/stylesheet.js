import csso from "gulp-csso";
import gulp from "gulp";
import sass from "gulp-sass";
import changed from "gulp-changed";

const sources = [
  "application/css/application.scss",
  "application/css/authenticate.scss"
];

gulp.task("stylesheet", () => {
  return gulp.src(sources)
    .pipe(changed("build/css"))
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest("build/css"));
});
