import gulp from "gulp";
import synchronize from "browser-sync";

gulp.task("watch", ["run"], () => {
  let browser = synchronize.create();

  browser
    .watch("application/css/**/*")
    .on("change", () => {
      gulp.start(["stylesheet"]);
    });

  browser
    .watch("application/**/*.{js,jsx}")
    .on("change", () => {
      gulp.start(["javascript"]);
    });
});
