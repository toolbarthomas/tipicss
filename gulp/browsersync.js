module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        // Setup the Browsersync Server
        var browserSync = NODE_MODULES.browserSync.init({
            server: (process.env.TIPICSS_DIST || './dist'),
            port: (process.env.TIPICSS_SERVER_PORT || 8080),
            startPath: 'groups/frontpage/pages/index.html',
            directory: true,
            reloadDebounce: 500,
            watchOptions: {
                ignoreInitial: true
            },
            files: [
                process.env.TIPICSS_DIST + '/main/stylesheets/index.css'
            ]
        });

        return browserSync;
    };
};