module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    const options = {
        read: false,
        readDelay: 250
    };

    return function (callback) {
        var stylesheets = GULP_PLUGINS.watch([
            process.env.TIPICSS_SRC + '/**/stylesheets/**/*.scss',
            process.env.TIPICSS_PACKAGES + '/**/stylesheets/**/*.scss',
        ], options, function(events, done) {

            return GULP.start('stylesheets');

        });

        var javascripts = GULP_PLUGINS.watch([
            process.env.TIPICSS_SRC + '/**/javascripts/**/*.js',
            process.env.TIPICSS_PACKAGES + '/**/javascripts/**/*.js',
        ], options, function (events, done) {

            return GULP.start('javascripts');

        });

        var spritesmith = GULP_PLUGINS.watch([
            process.env.TIPICSS_SRC + '/**/spritesmith/**/*.png'
        ], options, function (events, done) {

            return GULP.start('spritesmith');

        });

        var svgstore = GULP_PLUGINS.watch([
            process.env.TIPICSS_SRC + '/**/svg-sprite/**/*.svg'
        ], options, function (events, done) {

            return GULP.start('svgstore');

        });

        return NODE_MODULES.merge(stylesheets, javascripts, spritesmith, svgstore);
    };

};