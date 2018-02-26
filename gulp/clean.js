module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        return NODE_MODULES.del([
            './.tmp',
            process.env.TIPICSS_DIST + '/core',
            process.env.TIPICSS_DIST + '/main',
            process.env.TIPICSS_DIST + '/modules',
            process.env.TIPICSS_DIST + '/groups',
            process.env.TIPICSS_DIST + '/templates',
        ]);

    };
};