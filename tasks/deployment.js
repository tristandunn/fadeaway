/* global process */

import gulp from "gulp";
import https from "https";
import child_process from "child_process";

const HTTP_CREATED = 201;

gulp.task("deployment", (callback) => {
  child_process.exec("git rev-parse HEAD", (error, revision) => {
    let url = `
      https://api.honeybadger.io/v1/deploys?
        api_key=&
        deploy[environment]=production&
        deploy[local_username]=${process.env.USER}&
        deploy[revision]=${revision}
    `.replace(/\s+/g, "");

    https.get(url, (response) => {
      if (response.statusCode === HTTP_CREATED) {
        return callback();
      } else {
        return callback(new Error(`Deployment return ${response.statusCode} status.`));
      }
    });
  });
});
