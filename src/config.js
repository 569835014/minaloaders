const { resolve } = require('path')
const r = url => resolve(__dirname, url)
const assetsPath = resolve(process.cwd(), './build')

module.exports = {
    "json": {
        "pages":[
          "pages/todo/todo",
          "pages/add-todo/add-todo"
        ],
        "components":[
            "components/add-button/add-button",
        ],

        "tabBar": {
            "textColor": "#999999",
            "selectedColor": "#1B82D2",
            "backgroundColor": "#FFFFFF",
        }
    },
    "entry":[
    ],
    "assetsPath": assetsPath,
    "app": r('./app.js')
}
