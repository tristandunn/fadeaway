/* global process,require */

import AWS from "aws-sdk";
import File from "fs";
import gulp from "gulp";
import Utilities from "gulp-util";
import packageJSON from "../package.json";

let upload = (filename, callback) => {
  let bucket = new AWS.S3({
    params : {
      Key    : `releases/${filename}`,
      Bucket : process.env.AWS_BUCKET
    }
  });

  bucket.headObject((error, data) => {
    if (data) {
      callback(new Error(`The ${filename} object already exists.`));

      return;
    }

    Utilities.log("Uploading '%s'...", Utilities.colors.cyan(filename));

    bucket
      .upload({ Body: File.createReadStream(`release/${filename}`) })
      .send(callback);
  });
};

gulp.task("upload", (callback) => {
  require("dotenv").config();

  AWS.config.update({ region: process.env.AWS_REGION });

  let filename = `${packageJSON.name}-${packageJSON.version}`;

  upload(`${filename}.dmg`, (error) => {
    if (error) {
      return callback(error);
    }

    return upload(`${filename}.zip`, callback);
  });
});
