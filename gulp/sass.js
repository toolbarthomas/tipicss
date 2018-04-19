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

        // Default processors we use in combination with the postcss package
        var processors = [
            NODE_MODULES.autoprefixer(),
            NODE_MODULES.stylelint({
                "extends": [
                    "stylelint-config-standard",
                    "stylelint-scss"
                ],
                "plugins": [
                    "stylelint-scss"
                ],
                "rules": {
                    'no-duplicate-selectors': false
                }
            }),
            NODE_MODULES.reporter({
                clearReportedMessages: true,
                clearAllMessages: true,
                indentation: null,
            })
        ];

        // Append extra processors if we are running with the production flag
        if (process.env.TIPICSS_ENV == 'production') {
            processors.push(
                NODE_MODULES.cssnano()
            );
        }

        // Iterate trough each source we have defined within sources
        // Only compile modified Sass files
        sources.forEach(function (source, index) {

            var stream = GULP.src(source.input)
            .pipe(GULP_PLUGINS.newer(source.output))
            .pipe(GULP_PLUGINS.sourcemaps.init())
            .pipe(GULP_PLUGINS.sass({
                includePaths: [
                    process.env.TIPICSS_PACKAGES,
                    process.env.TIPICSS_SRC
                ],
                importer: NODE_MODULES.sassGlobImporter()
            }).on('error', GULP_PLUGINS.sass.logError))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output))
            .pipe(GULP_PLUGINS.filter('**/*.css'))
            .pipe(GULP_PLUGINS.postcss(processors))
            .pipe(GULP_PLUGINS.rename({ extname: '.min.css' }))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output));

            streams.push(stream);
        }, this);

        return NODE_MODULES.merge(streams);
    };
};