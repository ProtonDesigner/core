export interface IElectronAPI {
    getSettings: () => {},
    getPlugins: (pluginPath: string) => Promise,
    getPlugin: (pluginPath: string, pluginName: string) => any,
    logInfo: (message: string) => void,
    logWarn: (message: string) => void,
    logErr: (message: string) => void,
    // Local script stuff
    // createTempDir: (name: string, cb: () => {}) => {},
    // watchForChanges: (scriptDir: string, cb: () => {}) => {}
}

declare global {
    interface Window {
        electronAPI: IElectronAPI,
    }
}