module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {
    return function (callback) {

        // Default path for the package.json file
        var package = process.cwd() + '/package.json';

        // Create default data object where we parse our package.json into
        var data = {};

        // Abort if no package path has been defined
        if (!NODE_MODULES.fse.existsSync(package)) {
            return;
        }

        data = JSON.parse(NODE_MODULES.fse.readFileSync(package));

        if (!data instanceof Object && data.constructor === Object) {
            return;
        }

        // Check if the key shared_directories is defined as Array
        if(!Array.isArray(data.shared_directories)) {
            return;
        }

        // Define the default destination path for our shared directories
        var destination = process.env.TIPICSS_SHARED_DIRECTORIES || './.tmp';

        var resolve = GULP.src(data.shared_directories, {
            buffer: false,
            base: 'node_modules'
        })

        .pipe(GULP.dest(destination));

        return resolve;
    };
};