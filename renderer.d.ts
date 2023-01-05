export interface IElectronAPI {
    readThemeFile: (themeFilePath: string, callback: any) => {},
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}