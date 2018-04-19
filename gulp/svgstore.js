module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        var NODE_MODULES = {
            path: require('path')
        };

        var svgstore = GULP.src([
            process.env.TIPICSS_SRC + '/main/images/layout/svg-sprite/**/*.svg'
        ])
        .pipe(GULP_PLUGINS.newer(process.env.TIPICSS_DIST + '/main/images/layout'))
        .pipe(GULP_PLUGINS.plumber())
        .pipe(GULP_PLUGINS.filter(function (file) {
            return file.stat && file.contents.length;
        }))
        .pipe(GULP_PLUGINS.rename({
            prefix: 'glyph-'
        }))
        .pipe(GULP_PLUGINS.svgmin(function (file) {
            var prefix = NODE_MODULES.path.basename(file.relative, NODE_MODULES.path.extname(file.relative));

            return {
                plugins: [
                    {
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        },
                    },
                    {
                        removeAttrs: {
                            attrs: [
                                '(fill|stroke|class|style)',
                                'svg:(width|height)'
                            ]
                        }
                    }
                ]
            };
        }))
        .pipe(GULP_PLUGINS.svgstore({
            inlineSvg: true
        }))
        .pipe(GULP.dest(process.env.TIPICSS_DIST + '/main/images/layout'))

        return svgstore;
    };
};