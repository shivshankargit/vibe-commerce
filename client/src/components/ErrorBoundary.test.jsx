import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary.jsx'

const ProblemChild = () => {
    throw new Error('Test Error')
}

vi.spyOn(console, 'error').mockImplementation(() => { });

describe('ErrorBoundary Component', () => {
    it('displays a fallback UI when a child component throws an error', () => {
        render(
            <ErrorBoundary>
                <ProblemChild />
            </ErrorBoundary>
        )

        expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
    })

    it('renders children normally when there is no error', () => {
        render(
            <ErrorBoundary>
                <div>Hello World</div>
            </ErrorBoundary>
        )

        expect(screen.getByText('Hello World')).toBeInTheDocument()
        expect(screen.queryByText('Something went wrong.')).not.toBeInTheDocument()
    })
})