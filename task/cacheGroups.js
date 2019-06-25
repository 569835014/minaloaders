const { resolve } = require('path')
const fs = require('fs')
const cacheGroups = {  //缓存组 缓存公共代码
    commons: {  //公共模块
        name: "commons",
        chunks: "initial",  //入口处开始提取代码
        minSize: 0,      //代码最小多大，进行抽离
        minChunks: 2,    //代码复 2 次以上的抽离
    },
    vendors: {
        test: /node_modules/,
        name: 'vendors',
        minSize: 0,
        minChunks: 1,
        chunks: 'initial',
        priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
    }
}

let json=''
Object.keys(cacheGroups).forEach((key) => {
    json += `try {
        require('./${key}')
    }catch (e) {
        console.log(e)
    };\n`

});
console.log(process.cwd())
fs.writeFileSync(resolve(process.cwd(), './task/requireCommon.js'), json, 'utf-8')


module.exports = cacheGroups
