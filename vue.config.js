const path = require('path');
const resolve = dir => {
    return path.join(__dirname, dir)
}
module.exports = {
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html'
        }
    },
    chainWebpack: config => {
        config.module
            .rule('compile')
            .test(/\.js$/)
            .include
            .add(resolve('/src'))
            .end()
            .exclude
            .add(resolve('/node_modules'))
            .end()
            .use('babel')
            .loader('babel-loader')
            .options({
                presets: [
                    ['@babel/preset-env', {
                        modules: false
                    }]
                ]
            })
    },
    // 强制内联CSS
    css: {
        extract: false
    }
}