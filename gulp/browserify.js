module.exports = (GULP, GULP_PLUGINS, REVISION) => {
    return function (callback) {

        var NODE_MODULES = {
            buffer: require('vinyl-buffer'),
            babelify: require('babelify'),
            browserify: require('browserify'),
            glob: require('glob'),
            merge: require('merge-stream'),
            source: require('vinyl-source-stream')
        };

        var globs = [
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/main/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/modules/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/groups/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/templates/**/javascripts/*.js')
        ];

        var stream = [];

        for (var i = 0; i < globs.length; i++) {
            var files = globs[i];

            if(files.length === 0) {
                break;
            }

            for (var index = 0; index < files.length; index++) {
                var file = files[index];

                // Get the relative path of the current file
                var source_path = file.replace(
                    process.env.TIPICSS_SRC + '/',
                    ''
                );

                var browserify = NODE_MODULES.browserify({
                   entries: file,
                   debug: false,
                })
                .transform(NODE_MODULES.babelify).on('error', function(error) {
                    console.log(error);
                    process.emit('end');
                })
                .bundle()
                .pipe(NODE_MODULES.source(source_path))
                .pipe(NODE_MODULES.buffer())
                .pipe(GULP_PLUGINS.sourcemaps.init({ loadMaps: true }))
                .pipe(GULP_PLUGINS.sourcemaps.write('./'))
                .pipe(GULP.dest(process.env.TIPICSS_DIST));

                stream.push(browserify);
            }
        }

        return NODE_MODULES.merge(stream);
    };
};