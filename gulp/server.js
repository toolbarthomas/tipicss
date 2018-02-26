module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        // Setup the default server port for our webserver
        // Defaults to 8080
        var port = process.env.TIPICSS_SERVER_PORT || 8080;

        var server = GULP_PLUGINS.connect.server({
            root: (process.env.TIPICSS_DIST || './dist'),
            livereload: true,
            port: port
        });

        return server;

    };

};