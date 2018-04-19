module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        var NODE_MODULES = {
            del: require('del')
        };

        return NODE_MODULES.del([
            process.env.TIPICSS_DIST + '/core',
            process.env.TIPICSS_DIST + '/main',
            process.env.TIPICSS_DIST + '/modules',
            process.env.TIPICSS_DIST + '/groups',
            process.env.TIPICSS_DIST + '/templates',
        ]);
    };
};