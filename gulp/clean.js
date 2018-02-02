module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        return NODE_MODULES.del([
            process.env.TIPICSS_DIST + '/main',
            process.env.TIPICSS_DIST + '/modules',
            process.env.TIPICSS_DIST + '/groups',
            process.env.TIPICSS_DIST + '/templates'
        ]);

    };
};