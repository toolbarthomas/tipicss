module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        var ignores = [
            'handlebars',
            'twig',
            'md',
            'json'
        ];

        var src = GULP.src([
            process.env.TIPICSS_SRC + '/**/images/**',
            process.env.TIPICSS_SRC + '/**/webfonts/**',
            '!' + process.env.TIPICSS_SRC + '/**/*.{' + ignores + '}',
        ], {
            buffer: false,
            nodir: false
        })
        .pipe(GULP_PLUGINS.newer(process.env.TIPICSS_DIST))
        .pipe(GULP.dest(process.env.TIPICSS_DIST));

        return NODE_MODULES.merge(src);

    };
};