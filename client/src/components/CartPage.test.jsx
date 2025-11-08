import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../mocks/server'
import CartPage from './CartPage.jsx'
import { BrowserRouter } from 'react-router-dom' 

describe('CartPage Component', () => {
    const renderCart = () => {
        render(
            <BrowserRouter>
                <CartPage />
            </BrowserRouter>
        )
    }

    it('shows skeleton loader and then "cart is empty" message', async () => {
        renderCart()

        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)

        expect(await screen.findByText('Your cart is empty')).toBeInTheDocument()

        expect(screen.getByRole('link', { name: /Browse Products/i })).toBeInTheDocument()

        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    })

    it('renders cart items and the checkout form', async () => {
        server.use(
            http.get('http://localhost:3000/api/cart', () => {
                return HttpResponse.json({
                    items: [
                        {
                            _id: 'c1',
                            productId: { _id: 'p1', name: 'Test Cart Item', price: 50, imageUrl: 'img.jpg' },
                            quantity: 2
                        }
                    ],
                    total: '100.00'
                })
            })
        )

        renderCart()

        expect(await screen.findByText('Test Cart Item')).toBeInTheDocument()
        expect(screen.getByText('2')).toBeInTheDocument() 

        const summaryHeading = screen.getByRole('heading', { name: /Order Summary/i });
        const summaryBox = summaryHeading.closest('div');
        const totalInSummary = within(summaryBox).getByText('$100.00');
        expect(totalInSummary).toBeInTheDocument();

        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toBeInTheDocument()

        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()

        
    })
})