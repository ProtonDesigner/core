import { ProjectScript } from "./internal"

function newMainLuaFile() {
    return new ProjectScript("main.lua", "function main()\nend")
}

export { newMainLuaFile }
