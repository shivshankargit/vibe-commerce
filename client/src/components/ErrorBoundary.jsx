import React from 'react';
export default class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(err, info) { console.error(err, info); }
    render() { return this.state.hasError ? <div className="p-8 text-center">Something went wrong.</div> : this.props.children; }
}
