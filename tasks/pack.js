const fs = require('fs');
const settings = require('./settings');
const minifyHTML = require('html-minifier').minify;

exports.packHTML = packHTML;

function packHTML() {
	let html = fs.readFileSync(settings.paths.htmlSrc, {encoding: 'utf8'});
	html = minifyHTML(html, settings.htmlMinifier);
	fs.writeFileSync(settings.paths.html, html, {encoding: 'utf8'});
}
