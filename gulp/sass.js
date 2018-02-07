module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        var sources = [
            {
                input: [
                    process.env.TIPICSS_SRC + '/**/stylesheets/*.scss'
                ],
                output: process.env.TIPICSS_DIST
            },
            {
                input: [
                    process.env.TIPICSS_PACKAGES + '/tipicss-module*/stylesheets/*.scss'
                ],
                output: process.env.TIPICSS_DIST + '/modules'
            },
        ];

        var streams = [];

        // Iterate trough each source we have defined within sources
        // Only compile modified Sass files
        sources.forEach(function (source, index) {

            var stream = GULP.src(source.input)
            .pipe(GULP_PLUGINS.sourcemaps.init())
            .pipe(GULP_PLUGINS.sass({
                includePaths: [
                    process.env.TIPICSS_PACKAGES,
                    process.env.TIPICSS_SRC
                ],
                importer: NODE_MODULES.sassGlobImporter(),
            }).on('error', GULP_PLUGINS.sass.logError))
            .pipe(GULP_PLUGINS.autoprefixer())
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output))
            .pipe(GULP_PLUGINS.filter('**/*.css'))
            .pipe(GULP_PLUGINS.cssnano())
            .pipe(GULP_PLUGINS.rename({ extname: '.min.css' }))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output));

            streams.push(stream);
        }, this);

        return NODE_MODULES.merge(streams);

    };

};