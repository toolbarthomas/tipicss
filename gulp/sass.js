module.exports = (GULP, GULP_PLUGINS, REVISION) => {

    return function (callback) {

        var NODE_MODULES = {
            merge: require('merge-stream'),
            sassGlobImporter: require('node-sass-glob-importer'),
            stylelint: require('stylelint'),
            reporter: require('postcss-reporter')
        };

        var sources = [
            {
                input: [
                    process.env.TIPICSS_SRC + '/main/stylesheets/*.scss',
                    process.env.TIPICSS_SRC + '/modules/stylesheets/*.scss',
                    process.env.TIPICSS_SRC + '/groups/stylesheets/*.scss',
                    process.env.TIPICSS_SRC + '/templates/stylesheets/*.scss'
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

        // Enable multiple streams for our Gulp task
        var streams = [];

        // Default processors we use in combination with the postcss package
        const postcss_processors = [
            NODE_MODULES.stylelint(),
            NODE_MODULES.reporter({
                clearReportedMessages: true,
                clearAllMessages: true,
            })
        ];

        // Here you can setup extra PostCSS processors
        if (process.env.TIPICSS_ENV == 'production') {
            NODE_MODULES['autoprefixer'] = require('autoprefixer');
            NODE_MODULES['cssnano'] = require('cssnano');

            postcss_processors.push(
                NODE_MODULES.autoprefixer(),
                NODE_MODULES.cssnano()
            );
        }

        // Iterate trough each source we have defined within sources
        // Only compile modified Sass files
        for(var source in sources) {
            source = sources[source];

            var stream = GULP.src(source.input)
            .pipe(GULP_PLUGINS.newer(source.output))
            .pipe(GULP_PLUGINS.sourcemaps.init())
            .pipe(GULP_PLUGINS.sass({
                outputStyle: 'expanded',
                includePaths: [
                    process.env.TIPICSS_PACKAGES,
                    process.env.TIPICSS_SRC
                ],
                importer: NODE_MODULES.sassGlobImporter()
            }).on('error', GULP_PLUGINS.sass.logError))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output))
            .pipe(GULP_PLUGINS.filter('**/*.css'))
            .pipe(GULP_PLUGINS.postcss(postcss_processors))
            .pipe(GULP_PLUGINS.rename({ extname: '.min.css' }))
            .pipe(GULP_PLUGINS.sourcemaps.write('./'))
            .pipe(GULP.dest(source.output));

            streams.push(stream);
        }

        return NODE_MODULES.merge(streams);
    };
};