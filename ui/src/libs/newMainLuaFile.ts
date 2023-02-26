import { ProjectScript } from "@libs/project"

function newMainLuaFile() {
    return new ProjectScript("main.lua", "function main()\nend")
}

export { newMainLuaFile }
