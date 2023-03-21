import TauriFS from "@libs/tauriFS";
import * as path from "path"

async function initConfigDirs() {
    const baseHomeDir = path.join(await TauriFS.getHomeDir(), ".proton")
    if (!await TauriFS.exists(baseHomeDir)) {
        console.log("dir does not exist")
        TauriFS.mkdir(baseHomeDir)
        TauriFS.mkdir(path.join(baseHomeDir, "plugins"))
        TauriFS.mkdir(path.join(baseHomeDir, "themes"))
    }
}

export {
    initConfigDirs
}
