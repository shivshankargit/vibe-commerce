import { vi, beforeAll, afterAll, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { server } from './mocks/server.js'

// ---
// ALL MOCKS NOW LIVE IN THIS FILE
// ---

// Mock UI Components
// Paths are relative to this file (src/setupTests.js)
vi.mock('./components/ui/Skeleton.jsx', () => ({
    default: (props) => <div data-testid="skeleton" {...props} />,
}))

vi.mock('./components/ui/Modal.jsx', () => ({
    default: ({ open, onClose, children }) =>
        open ? (
        <div data-testid="modal">
            {children}
            <button onClick={onClose}>Close Modal</button>
        </div>
    ) : null,
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        // Pass props through to avoid React warnings
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        li: ({ children, ...props }) => <li {...props}>{children}</li>,
        },
    AnimatePresence: ({ children }) => <div>{children}</div>,
}))

// Mock lazy-load-image
vi.mock('react-lazy-load-image-component', () => ({
    LazyLoadImage: ({ wrapperClassName, ...props }) => <img {...props} />,
}))


// ---
// MSW SERVER SETUP
// ---
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())