import PluginManager from "./libs/plugin"

export default interface BaseComponentProps {
    className: string
    state: any
    setState(newState: Object): void
    setPage(newState: number): void
    pluginManager: PluginManager
    dialogUtils: {
        createDialog: Function,
        setDialog: Function,
        showDialog: Function
    }
}