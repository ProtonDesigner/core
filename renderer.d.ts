export interface IElectronAPI {
    getSettings: () => {},
    getPlugins: () => Promise,
    getPlugin: (pluginName: string) => any,
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