module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        const options = {
            read: false,
            readDelay: 250
        };

        GULP_PLUGINS.livereload.listen();

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

        var twig = GULP_PLUGINS.watch([
            process.env.TIPICSS_SRC + '/**/*twig',
            process.env.TIPICSS_PACKAGES + '/**/*.twig',
        ], options, function (events, done) {

            return GULP.start('twig');

        });

        var reload = GULP_PLUGINS.watch([
            process.env.TIPICSS_DIST + '/main/stylesheets/index.css'
        ], options, function (events, done) {

            NODE_MODULES.chalk.yellow('Livereload!');

            GULP_PLUGINS.livereload.reload();
        });

        return NODE_MODULES.merge(
            stylesheets,
            javascripts,
            twig,
            spritesmith,
            svgstore,
            reload
        );
    };

};