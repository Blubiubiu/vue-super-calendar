module.exports = {
    configureWebpack: () => {
        return {
            entry: './src/lib/index.js',
            output: {
                filename: 'js/vue-super-calendar.min.js',
                library: 'vue-super-calendar',
                libraryTarget: 'umd',
                umdNamedDefine: true
            }
        }
    }
}