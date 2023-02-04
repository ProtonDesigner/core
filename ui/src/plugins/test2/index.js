const plugin = require("@techstudent10/plugin")

const ProtonPlugin = plugin.default

class MyPlugin extends ProtonPlugin {
    editor_saveProject() {
        console.log("hello world from plugin num 2!")
    }
}

module.exports = MyPlugin

