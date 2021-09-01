global.Promise = require('pinkie-promise');
const settings = require('./settings');
const pack = require('./pack');
const browserify = require('browserify');
const fs = require('fs');
const minify = require('terser').minify;
const css = require('./css');

pack.packHTML();
css.compile(function () {
	new Promise(function (resolve, reject) {
		console.log('Bundling', settings.paths.jsSrc);
		var b = browserify(settings.paths.jsSrc, {
			debug: false,
			// noparse: [ 'three' ]
		});
		settings.transforms.forEach(function (t) {
			b.transform(t);
		});
		b.bundle(function (err, src) {
			if (err) return reject(err);
			console.log('Compressing', settings.paths.jsSrc);

			var minifyPromise = minify(src.toString(), {
				sourceMap: false,
			}).then((result) => {
				console.log('Writing', settings.paths.jsBuildFilePath);
				fs.writeFile(settings.paths.jsBuildFilePath, result.code, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
		});
	}).catch(function (err) {
		console.error(err);
	});
});
