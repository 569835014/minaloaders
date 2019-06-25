require('shelljs/global')

const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const _ = require('lodash')
const r = url => resolve(process.cwd(), url)
const config = require('../src/config')
const webpackConf = require('./webpack.conf')

const assetsPath = config.assetsPath

rm('-rf', assetsPath)
mkdir(assetsPath)

const renderConf = webpackConf
const entry = () => _.reduce(config.json.pages.concat(config.json.components), (en, i) => {
    en[i] = resolve(__dirname, '../src', `${i}.mina`)

    return en
}, {})

renderConf.output = {
    path: config.assetsPath,
    filename: '[name].js',
    globalObject: 'System'
}

renderConf.entry = entry()
config.entry.map((item) => {
    renderConf.entry[item] = resolve(__dirname, '../src', `${item}`)
})

renderConf.devtool = false

renderConf.entry.app = config.app
const compiler = webpack(renderConf)

fs.writeFileSync(resolve(config.assetsPath, './app.json'), JSON.stringify(config.json), 'utf8')
// fs.writeFileSync(resolve(config.assetsPath, './app.js'), JSON.stringify(app+requireCommon), 'utf8')


compiler.watch({}, (err, stats) => {
    if (err) process.stdout.write(err)
    setTimeout(()=>{
        const app = fs.readFileSync(resolve(config.assetsPath, './app.js'), 'utf-8')
        const requireCommon = fs.readFileSync(resolve(process.cwd(),'./task/requireCommon.js'), 'utf-8')
        fs.writeFileSync(resolve(config.assetsPath, './app.js'), requireCommon+'\n'+app, 'utf8')
    },40)

    console.log('[webpack:build]', stats.toString({
        chunks: false,
        colors: true
    }))
})
