import React from "react"
import "./Error.scss"

type Props = {
    children: React.ReactNode
}
type State = {
    hasError: boolean,
    error: null | Error
}

class ErrorBoundary extends React.Component<Props, State> {
    state: {
        hasError: boolean,
        error: null | Error,
        errorInfo: null | React.ErrorInfo
    } = {
        hasError: false,
        error: null,
        errorInfo: null
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            error
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo)
        this.state.errorInfo = errorInfo
    }

    render() {
        if (this.state.hasError) {
            return <div className="error">
                <h2>An error occurred!</h2>
                <pre>
                    <code>
                        {this.state.error?.stack}
                    </code>
                </pre>
            </div>
        }
        return this.props.children
    }
}

export default ErrorBoundary
