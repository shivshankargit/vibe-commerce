import { render, screen, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import Navbar from './Navbar.jsx'

vi.mock('@heroicons/react/24/outline', () => ({
    ShoppingBagIcon: () => <div data-testid="bag-icon" />,
}))

const renderNavbar = () => {
    render(
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>
    )
}

describe('Navbar Component', () => {
    it('renders the logo and cart icon', () => {
        renderNavbar()
        expect(screen.getByText('Vibe Commerce')).toBeInTheDocument()
        expect(screen.getByTestId('bag-icon')).toBeInTheDocument()
    })

    it('fetches and displays a cart count of 0 (and no badge)', async () => {
        renderNavbar()

        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0))
        })

        const badge = screen.queryByRole('status', { 'aria-live': 'polite' })
        expect(badge).not.toBeInTheDocument()
    })

    it('fetches and displays the correct cart count', async () => {
        server.use(
            http.get('http://localhost:3000/api/cart', () => {
                return HttpResponse.json({
                    items: [{ quantity: 1 }, { quantity: 2 }] 
                })
            })
        )

        renderNavbar()

        const badge = await screen.findByText('3')
        expect(badge).toBeInTheDocument()
        expect(badge).toHaveClass('bg-indigo-600')
    })

    it('updates the cart count when "cart:updated" event is fired', async () => {
        renderNavbar()

        await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)) })
        expect(screen.queryByRole('status', { 'aria-live': 'polite' })).not.toBeInTheDocument()

        server.use(
            http.get('http://localhost:3000/api/cart', () => {
                return HttpResponse.json({
                    items: [{ quantity: 5 }] 
                })
            })
        )

        await act(async () => {
            window.dispatchEvent(new CustomEvent('cart:updated'))
            // Give React time to process the async state update
            await new Promise((resolve) => setTimeout(resolve, 0));
        })

        expect(await screen.findByText('5')).toBeInTheDocument()

        act(() => {
            window.dispatchEvent(new CustomEvent('cart:updated'))
        })

        const badge = await screen.findByText('5')
        expect(badge).toBeInTheDocument()
    })
})