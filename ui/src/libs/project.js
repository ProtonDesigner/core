const { default: Project, ProjectElement } = require('./project')

const _project = new Project()
const element = new ProjectElement()
_project.addElement(element)
console.log(_project.serialize())

