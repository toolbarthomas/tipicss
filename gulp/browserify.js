module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        var globs = [
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/groups/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/main/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/templates/**/javascripts/*.js'),
            NODE_MODULES.glob.sync(process.env.TIPICSS_SRC + '/modules/**/javascripts/*.js')
        ];

        var stream = [];

        globs.forEach(function(files) {

            if(files.length === 0) {
                return;
            }

            files.forEach(function(file) {

                // Get the relative path of the current file
                var source_path = file.replace(
                    process.env.TIPICSS_SRC + '/',
                    ''
                );

                var b = NODE_MODULES.browserify({
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

                stream.push(b);
            });
        });

        return NODE_MODULES.merge(stream);

    };
};