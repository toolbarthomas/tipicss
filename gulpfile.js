const NAMESPACE = 'tipicss';

// Require environment variabels from .env
// We use these variables to set a custom src/dist path
// for our gulp tasks
const ENV = require('dotenv').config();

// We use Gulp for our build system
// Each gulp task is defined as a seperate task located in ./gulp
const GULP = require('gulp');

// Autoload all Gulp modules that are installed from the package.json
// More information: https://www.npmjs.com/package/gulp-load-plugins
const GULP_PLUGINS = require('gulp-load-plugins')();

// Require all modules we use for our
// gulp tasks located in ./gulp
const NODE_MODULES = {
    chalk: require('chalk'),
    del: require('del'),
    fse: require('fs-extra'),
    merge: require('merge-stream'),
    path: require('path'),
    runSequence: require('run-sequence').use(GULP)
};

// Create a revision timesamp of the current date in milliseconds.
// We use this timestamp as suffix for some generated files: i.e. spritesmith.js
const REVISION = new Date().getTime();

(function () {
    "use strict";

    // Exit Gulp if we have no environment file
    if (ENV.error) {
        exit('An environment(./.env) file is required for this workflow. You can create one by duplicating ./.env.dist example.This file should be located in ' + process.cwd());
    }

    // Throw an error & abort the Gulp process
    // when one or more of the following environment variables are undefined
    if (!process.env.TIPICSS_SRC || !process.env.TIPICSS_DIST || !process.env.TIPICSS_PACKAGES) {
        exit('The src path from our .env file is not defined, please check again.');
    }

    // Parses all Totemcss twig documents.
    // Stylesheet tasks should run before parsing any twig files
    // so we can import any generated stylesheet file
    GULP.task('twig', requireGulpTask('twig'));

    // Default Gulp task that will run all
    // the necessary tasks to generate a development ready build
    GULP.task('default', function (callback) {
        NODE_MODULES.runSequence(
            'twig',
            callback
        );
    });

}());

// Helper function for displaying messages with Node Chalk
// This function will also exit the current Node process.
function exit(message) {
    console.log(NODE_MODULES.chalk.red('[ ' + NAMESPACE + ' ]' + ' - ' + message));
    process.exit(1);
}

// Simple helper for requiring Gulp tasks defined in seperate files
// Each Gulp is located within ./gulp
function requireGulpTask(file) {
    return require('./gulp/' + file)(GULP, GULP_PLUGINS, NODE_MODULES, REVISION);
}
