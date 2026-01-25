import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="glass-panel" style={{ padding: '20px', color: 'var(--danger-color)', textAlign: 'center' }}>
                    <h3>Something went wrong.</h3>
                    <p>{this.state.error?.message || "Unknown error"}</p>
                    <button
                        className="macos-btn"
                        onClick={() => this.setState({ hasError: false })}
                        style={{ marginTop: '10px' }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
