export default interface BaseComponentProps {
    className: string
    state: Object
    loading: boolean
    setState(newState: Object): void
    setPage(newState: number): void
    setLoading(newState: boolean): void
}