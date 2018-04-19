module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        // Gulp task for resolving installed packages
        // Copied files will be placed within the vendor folder from the destination path
        // The vendors object within the package.json should be parsed as an Object
        // Where the key will be the base destination directory and it's value will be the source path

        var NODE_MODULES = {
            eventStream: require('event-stream'),
            fse: require('fs-extra'),
            merge: require('merge-stream'),
            path: require('path')
        };

        // Default path for the package.json file
        var package = {
            path: process.cwd() + '/package.json',
            data: {}
        };

        // Abort if no package path has been defined
        if (!NODE_MODULES.fse.existsSync(package.path)) {
            return NODE_MODULES.eventStream.merge([]);
        }

        // Parse package.json
        package.data = JSON.parse(
            NODE_MODULES.fse.readFileSync(package.path)
        );

        // Abort if the vendors array is not present within the package_json
        if (package.data.vendors == null || Object.keys(package.data.vendors).length === 0) {
            return NODE_MODULES.eventStream.merge([]);
        }

        var stream = [];

        // Iterate trough vendors and append it to the source key
        Object.keys(package.data.vendors).forEach(function(key) {

            var vendor = package.data.vendors[key];

            if (typeof vendor !== 'string') {
                return;
            }

            var glob = NODE_MODULES.path.format({
                root: process.cwd(),
                dir: vendor,
                base: '**'
            });

            var dest = NODE_MODULES.path.join(
                process.env.TIPICSS_DIST,
                'vendor',
                key
            );

            var resolve = GULP.src([
                glob
            ], {
                buffer: false,
            })
            .pipe(GULP_PLUGINS.cached(key))
            .pipe(
                GULP.dest(dest)
            );

            stream.push(resolve);
        });

        return NODE_MODULES.merge(stream);
    };
};