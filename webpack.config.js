const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './public/IndexPage.js'],
  output: {
    filename: 'site.js',
    path: path.resolve(__dirname, 'public')
  },
	module: {
		rules: [
			{
			test: /\.js$/,
			include: [
				path.resolve(__dirname),
			],
			use: {
				loader: 'babel-loader',
				options: {
				presets: ['env']
				}
			}
			}
		]
  },
  resolve: {
	extensions: ['.js']
  }  
};
