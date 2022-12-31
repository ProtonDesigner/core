export default interface BaseComponentProps {
    className: string
    state: any
    setState(newState: Object): void
    setPage(newState: number): void
}