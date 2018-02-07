module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        NODE_MODULES.del(process.env.TIPICSS_DIST + '/main/images/layout/sprite.*.png');

        var spritesmith = GULP.src(process.env.TIPICSS_SRC + '/main/images/layout/sprite/**/*.png')
        .pipe(GULP_PLUGINS.cached('spritesmith'))
        .pipe(GULP_PLUGINS.plumber())
        .pipe(GULP_PLUGINS.spritesmith({
            padding: 4,
            imgName: 'sprite.' + REVISION + '.png',
            cssName: '_spritesmith.scss',
            cssTemplate: process.env.TIPICSS_SRC + '/main/images/layout/sprite/config.handlebars',
            cssHandlebarsHelpers: {
                imageSource: function (image) {
                    return '/main/images/layout/sprite.' + REVISION + '.png';
                },
                divideRetina: function (value) {
                    return parseInt(value) / 2;
                }
            }
        }));

        var sprite = spritesmith.img
        .pipe(NODE_MODULES.buffer())
        .pipe(GULP.dest(process.env.TIPICSS_DIST + '/main/images/layout/'));


        var stylesheet = spritesmith.css
        .pipe(GULP.dest(process.env.TIPICSS_SRC + '/main/stylesheets/settings/'));

        return NODE_MODULES.merge(sprite, stylesheet);

    };

};