module.exports = (GULP, GULP_PLUGINS, NODE_MODULES, REVISION) => {

    return function (callback) {

        // Iterate between each type of component withing the project.
        var sources = [
            {
                input: [
                    process.env.TIPICSS_SRC + '/groups/*/pages/**.twig',
                    process.env.TIPICSS_PACKAGES + '/tipicss-module*/pages/**.twig',
                ],
                output: process.env.TIPICSS_DIST + '/groups'
            }
        ];

        // Define the global json file so can share data between multiple pages
        var global_json = {
            path: process.cwd() + '/data.json',
            data: {}
        };

        var data = {};

        // Insert the data from the global data.json file within our json.data
        if (NODE_MODULES.fse.existsSync(global_json.path)) {
            data = JSON.parse(NODE_MODULES.fse.readFileSync(global_json.path));
        }

        // Setup the streams where we push each Gulp instance
        // And return the whole object all together
        var streams = [];

        // // Tmp cache location for json streams
        // var tap_cache;

        // Iterate trough each source so we can transform all twig sources
        // Return each iterated object into the stream.
        sources.forEach(function (source) {

            // Abort if we have no inout within our source
            if (source.input === 0) {
                return;
            }

            var stream = GULP.src(source.input, {
                nodir: true
            })
            .pipe(GULP_PLUGINS.plumber())
            .pipe(GULP_PLUGINS.twig({
                base: './',
                data: data,
                namespaces: {
                    'tipicss': '../' + (process.cwd()).substring((process.cwd()).lastIndexOf("/") + 1) + '/' + (process.env.TIPICSS_SRC).replace('./', ''),
                    'tipicss_packages': NODE_MODULES.path.normalize(process.env.TIPICSS_PACKAGES)
                },
                onError: function (error) {
                    if (!error) {
                        return;
                    }
                }
            }))
            .pipe(GULP_PLUGINS.faker())
            .pipe(GULP.dest(source.output));

            streams.push(stream);

        }, this);

        return NODE_MODULES.merge(streams);

    };

};