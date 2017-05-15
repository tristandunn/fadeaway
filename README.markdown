# Fadeaway

A desktop application for uploading to Dribbble.

## Setup

Install the dependencies.

    npm install

Install `gulp` globally, if you don't have `./node_modules/.bin` in your path.

    npm install -g gulp

## Development

To run the application.

    gulp run

To run the application, and reload the renderer code when changed.

    gulp watch

Before pushing changes, check the code.

    gulp lint

## Releasing

To generate a release, with a compiled and signed application complete with a
ZIP and DMG version.

    gulp release

To generate a release, upload, and send a deployment notification. (Ensure the
version has been incremented appropriately in the `package.json` file.)

    gulp release:production

After the release is uploaded, you need to [create a release][1] in the
administration with a version that matches the new version.




[1]: https://getfadeaway.com/administration/releases
