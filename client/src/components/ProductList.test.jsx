import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ProductList from './ProductList.jsx'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}))

describe('ProductList Component', () => {
    it('shows skeleton loaders and then renders products', async () => {
        render(<ProductList />)

        // 1. Check for the skeletons
        // We expect 8 skeletons based on your code
        expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)

        // 2. Wait for the API call to finish and products to appear
        expect(await screen.findByText('Mock Product 1')).toBeInTheDocument()
        expect(screen.getByText('$10.00')).toBeInTheDocument()

        // 3. Check that the skeletons are gone
        expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument()
    })

    it('shows a success toast when "Add to Cart" is clicked', async () => {
        const user = userEvent.setup()
        render(<ProductList />)

        // Wait for products to load
        const addButtons = await screen.findAllByRole('button', { name: /Add .* to cart/i })

        // Click the first product's button
        await user.click(addButtons[0])

        // Check that our mocked toast.success function was called correctly
        expect(toast.success).toHaveBeenCalledWith('Mock Product 1 added to cart!')
    })
})