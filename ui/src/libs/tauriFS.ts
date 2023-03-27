import { invoke } from "@tauri-apps/api";

namespace TauriFS {
    export async function listDir(directory: string): Promise<string[]> {
        return await invoke("list_dir", { directory, isDebug: false })
    }

    export async function readFile(filePath: string): Promise<string> {
        return await invoke("read_file", { filePath })
    }

    export async function writeFile(filePath: string, data: string) {
        await invoke("write_file", { filePath, data })
    }

    export async function mkdir(directoryPath: string) {
        await invoke("mkdir", { directoryPath })
    }

    export async function cwd(): Promise<string> {
        return await invoke("cwd")
    }

    export async function exists(path: string): Promise<boolean> {
        return await invoke("exists", { path })
    }

    export async function getHomeDir(): Promise<string> {
        return await invoke("get_home_dir")
    }

    export async function rmdir(directoryPath: string): Promise<void> {
        return await invoke("rmdir", { directoryPath })
    }

    export async function rmfile(path: string): Promise<void> {
        return await invoke("rmfile", { path })
    }
}

export default TauriFS
