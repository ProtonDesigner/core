export interface IElectronAPI {
    getSettings: () => {},
    // Local script stuff
    // createTempDir: (name: string, cb: () => {}) => {},
    // watchForChanges: (scriptDir: string, cb: () => {}) => {}
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}