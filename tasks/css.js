const settings = require('./settings');
const sass = require('node-sass');
const fs = require('fs');
const path = require('path');
const mixIn = require('mout/object/mixIn');

exports.compile = compile;

function compile(cb, opts) {
	sass.render(
		mixIn(
			{
				file: settings.paths.scssFilePath,
				outputStyle: opts && opts.outputStyle ? opts.outputStyle : 'compressed',
				includePaths: [settings.paths.scssPath],
			},
			opts
		),
		function (err, result) {
			if (!err) {
				var dir = path.dirname(settings.paths.cssBuildFilePath);
				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}
				fs.writeFileSync(settings.paths.cssBuildFilePath, result.css, {encoding: 'utf8'});
				if (cb) cb();
			} else {
				console.log(err);
			}
		}
	);
}
