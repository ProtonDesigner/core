import { Project } from "./internal"

interface BinaryOptions {}

const project = new Project()
type SerializeReturnType = ReturnType<typeof project.serialize>

class ProjectBinary {
    options: BinaryOptions

    constructor(options?: BinaryOptions) {
        this.options = options || {}
    }

    serialize(project: Project) {
        const projectObject = project.serialize()
        const projectString = JSON.stringify(projectObject)
        let output = ""
        for (var i = 0; i < projectString.length; i++) {
            output += projectString[i].charCodeAt(0).toString(2) + " "
        }
        return output
    }

    deserialize<T>(binary: string): T {
        let newBinary = binary.split(" ")
        let jsonStr = ""
        for (let i = 0; i < newBinary.length; i++) {
            jsonStr += String.fromCharCode(parseInt(newBinary[i], 2))
        }
        return JSON.parse(jsonStr)
    }
}

const test = new ProjectBinary({})

console.log(test.serialize(project))
console.log(test.deserialize<SerializeReturnType>(test.serialize(project)))

export default ProjectBinary
export type { SerializeReturnType }
export {
    BinaryOptions
}
