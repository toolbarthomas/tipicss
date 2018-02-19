module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        var sources = [
            {
                input: [
                    process.env.TIPICSS_SRC + '/**/javascripts/*.js'
                ],
                output: process.env.TIPICSS_DIST
            },
            {
                input: [
                    process.env.TIPICSS_PACKAGES + '/tipicss-module*/javascripts/*.js'
                ],
                output: process.env.TIPICSS_DIST + '/modules'
            },
        ];

        var streams = [];

        // Iterate trough each source we have defined within sources
        // Only compile modified Sass files
        sources.forEach(function (source, index) {

            var stream = GULP.src(source.input)
            .pipe(GULP_PLUGINS.plumber())
            .pipe(GULP_PLUGINS.filter(function (file) {
                return file.stat && file.contents.length;
            }))
            .pipe(GULP_PLUGINS.sourcemaps.init())
            .pipe(GULP_PLUGINS.tap(function(file) {
                var basename = NODE_MODULES.path.basename(file.path);
                var ext = NODE_MODULES.path.extname(basename);
                var name = NODE_MODULES.path.basename(file.path, ext);

                // Hook Browserify into our current file/stream
                file.contents = NODE_MODULES.browserify(file.path, {
                    debug: true,
                    standalone: NODE_MODULES.camelCase(name)
                })

                .transform(NODE_MODULES.vueify)
                .transform(NODE_MODULES.babelify)
                .bundle()
                .on('error', function (err) {
                    console.error(err);

                    this.emit('end');
                });

            }))
            .pipe(NODE_MODULES.buffer()) // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output))
            .pipe(GULP_PLUGINS.filter('**/*.js'))
            .pipe(GULP_PLUGINS.uglify())
            .pipe(GULP_PLUGINS.rename({ extname: '.min.js' }))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output));

            streams.push(stream);
        }, this);

        return NODE_MODULES.merge(streams);

    };
};