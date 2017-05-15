import fs from "fs";
import gulp from "gulp";
import install from "gulp-install";
import packageJSON from "../package.json";

gulp.task("install:package", (callback) => {
  let data = JSON.parse(JSON.stringify(packageJSON));

  delete data.devDependencies;

  fs.writeFile("build/package.json", JSON.stringify(data), callback);
});

gulp.task("install", ["install:package"], () => {
  return gulp.src(["build/package.json"])
    .pipe(install({ args: ["silent"], production: true }));
});
