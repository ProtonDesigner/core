export interface IElectronAPI {
    getSettings: () => {},
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}