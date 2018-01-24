module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        var sources = [
            {
                input: [
                    process.env.TIPICSS_SRC + '/main/stylesheets/*.scss'
                ],
                output: process.env.TIPICSS_DIST + '/main/stylesheets'
            }
        ];

        var streams = [];

        // Iterate trough each source we have defined within sources
        // Only compile modified Sass files
        sources.forEach(function (source) {

            var stream = GULP.src(source.input)
            .pipe(GULP_PLUGINS.cached('sass'))
            .pipe(GULP_PLUGINS.sourcemaps.init())
            .pipe(GULP_PLUGINS.sassGlob())
            .pipe(GULP_PLUGINS.sass({
                includePaths: [
                    process.env.TIPICSS_PACKAGES
                ]
            }).on('error', GULP_PLUGINS.sass.logError))
            .pipe(GULP_PLUGINS.autoprefixer())
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output));

            streams.push(stream);
        }, this);

        return NODE_MODULES.merge(streams);

    };
};