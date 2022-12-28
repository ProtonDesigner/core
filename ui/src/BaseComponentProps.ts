export default interface BaseComponentProps {
    className: string
    state: Object
    setState(newState: Object): void
    setPage(newState: number): void
}