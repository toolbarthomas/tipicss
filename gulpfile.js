"use strict";

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
    babelify: require('babelify'),
    browserify: require('browserify'),
    buffer: require('vinyl-buffer'),
    camelCase: require('camelcase'),
    chalk: require('chalk'),
    del: require('del'),
    fse: require('fs-extra'),
    merge: require('merge-stream'),
    path: require('path'),
    runSequence: require('run-sequence').use(GULP),
    sassGlobImporter: require('node-sass-glob-importer'),
};

// Create a revision timesamp of the current date in milliseconds.
// We use this timestamp as suffix for some generated files: i.e. spritesmith.js
const REVISION = new Date().getTime();

// Exit Gulp if we have no environment file
if (ENV.error) {
    exit('An environment(./.env) file is required for this workflow. You can create one by duplicating ./.env.dist example.This file should be located in ' + process.cwd());
}

// Throw an error & abort the Gulp process
// when one or more of the following environment variables are undefined
if (!process.env.TIPICSS_SRC || !process.env.TIPICSS_DIST || !process.env.TIPICSS_PACKAGES) {
    exit('The src path from our .env file is not defined, please check again.');
}

// Gulp task that cleans up the distribution folder
// before processing any new streams
GULP.task('clean', requireGulpTask('clean'));

// Parses all twig documents.
// Any other asset-related tasks should run before parsing any twig files
// so we can import any generated stylesheet file
GULP.task('twig', requireGulpTask('twig'));

// Convert a set of images into a spritesheet and Sass variables
// You should run spritesmith before running the Sass tasks since Spritesmith also generates an config file
GULP.task('spritesmith', requireGulpTask('spritesmith'));

// Tasks for compiling Sass stylesheets
GULP.task('sass', requireGulpTask('sass'));

// Alias for running all stylesheet related tasks
GULP.task('stylesheets', function (callback) {
    NODE_MODULES.runSequence(
        'spritesmith',
        [
            'sass',
            'svgstore'
        ],
        callback
    );
});

// Transpile ES2015 (or later) javascript file to ES5 compatible browsers with Browserify
// Files should be located within the `**/javascripts/` structure in order for Browserify to work with it's default configuration
// Any partial files should be structured within a sub directory located in `javascripts`.
// Gulp will eventually ignore those partial files since we bunddle them
GULP.task('browserify', requireGulpTask('browserify'));

// Alias for running all stylesheet related tasks
GULP.task('javascripts', function (callback) {
    NODE_MODULES.runSequence(
        'browserify',
        callback
    );
});

// Combine svg files into one with <symbol> elements
GULP.task('svgstore', requireGulpTask('svgstore'));

// Setup a webserver, defaults to port 8080
GULP.task('server', requireGulpTask('server'));

// Default Gulp task that will run all the necessary
// tasks to generate a development ready build
GULP.task('default', function (callback) {
    NODE_MODULES.runSequence(
        'clean',
        'twig',
        [
            'stylesheets',
            'javascripts'
        ],
        callback
    );
});


// Watch streams with Gulp-Watch
GULP.task('watch', requireGulpTask('watch'));

// Gulp task that generates a new development-ready build
// This will also start an webserver with watchreload support
GULP.task('serve', function (callback) {
    NODE_MODULES.runSequence(
        'default',
        [
            'watch',
            'server'
        ],
        callback
    );
});

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
