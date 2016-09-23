 module.exports = {
     entry: './src/app.js',
     output: {
         path: './',
         filename: 'public/app.bundle.js'
     },
     resolve: {
         extensions: ["", ".webpack.js", ".web.js", ".js"]
     },
     module: {
        loaders: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel?presets[]=es2015"
            }
        ]
    }
};
