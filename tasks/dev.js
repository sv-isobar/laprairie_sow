const settings = require('./settings');
const pack = require('./pack');
const budo = require('budo');
const opn = require('opn');
const path = require('path');
const fs = require('fs');
const os = require('os');
const simpleHtml = require('simple-html-index');

const css = require('./css');
css.compile();
pack.packHTML();

let isSkipLiveReload = false;

var app = budo(settings.paths.jsSrc, {
	serve: path.relative(settings.paths.buildDir, settings.paths.jsBuildFilePath),
	// host: os.hostname(),
	// port: 9966,
	ssl: true,
	cors: true,
	pushstate: true,
	dir: settings.paths.buildDir,
	stream: process.stdout,
	defaultIndex: function (opt) {
		var html = settings.paths.html;
		if (!fs.existsSync(html)) return simpleHtml(opt);
		return fs.createReadStream(html);
	},
	browserify: {
		transform: settings.transforms,
	},
})
	.live()
	.watch(['**/*.*', '!tasks/*.*', '!node_modules/*.*'])
	.on('watch', function (ev, file) {
		file = path.resolve(file);
		if (file.indexOf(settings.paths.srcPath) < 0 && file.indexOf(settings.paths.buildDir) < 0) {
			return;
		}
		if (file.indexOf(settings.paths.scssPath) === 0) {
			setTimeout(css.compile, 4);
		} else if (file.indexOf(settings.paths.htmlSrc) === 0) {
			delayReload(pack.packHTML, file);
		} else {
			if (!isSkipLiveReload) app.reload(file);
		}
	})
	// when bundle starts changing, reload page entirely
	.on('pending', function () {
		app.reload();
	})
	.on('connect', function (ev) {
		const uri = ev.uri;
		opn(uri);
	});

function delayReload(func, file) {
	isSkipLiveReload = true;
	func(file);
	setTimeout(function () {
		app.reload(file);
		isSkipLiveReload = false;
	}, 200);
}
