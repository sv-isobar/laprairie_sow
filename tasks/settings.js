const path = require('path');

const paths = {
	srcPath: __dirname + '/../src/',
	buildDir: __dirname + '/../public/',

	html: __dirname + '/../public/index.html',
	htmlSrc: __dirname + '/../src/index.html',

	jsSrc: __dirname + '/../src/index.js',
	jsBuildFilePath: __dirname + '/../public/assets/js/index.js',
	jsBuildPath: __dirname + '/../public/assets/js/',

	scssFilePath: __dirname + '/../src/scss/index.scss',
	scssPath: __dirname + '/../src/scss/',
	cssBuildFilePath: __dirname + '/../public/assets/css/index.css',
	includedHTMLs: ['index.html'],
};

for (let i in paths) {
	let pth = paths[i];
	if (typeof pth === 'string') {
		paths[i] = path.resolve(pth);
	}
}

module.exports = {
	paths: paths,
	htmlMinifier: {
		collapseInlineTagWhitespace: true,
		conservativeCollapse: true,
		collapseWhitespace: true,
		removeComments: true,
	},
	transforms: [
		// glslify-hex needs to add in the package in order to get this work :/
		['glslify'],
		['scrollmagic'],

		['stringify', {appliesTo: {includeExtensions: ['.glsl', 'tmpl']}}],

		[
			'babelify',
			{
				presets: ['@babel/preset-env'],
				sourceMaps: true,
				global: true,
				// ignore: ['node_modules/three'],
			},
		],

		// ["aliasify", {
		//     "aliases": {
		//       "three": __dirname + '/../third_party/three/Three.js'
		//     }
		// }]
	],
};
