// src/mocks/uiMocks.jsx
import { vi } from 'vitest';

// --- FIX THIS PATH ---
// Use a relative path from the project root
vi.mock('./src/components/ui/Skeleton.jsx', () => ({
    default: (props) => <div data-testid="skeleton" {...props} />,
}));

// --- FIX THIS PATH ---
// Use a relative path from the project root
vi.mock('./src/components/ui/Modal.jsx', () => ({
    default: ({ open, onClose, children }) =>
        open ? (
            <div data-testid="modal">
                {children}
                <button onClick={onClose}>Close Modal</button>
            </div>
        ) : null,
}));

// Mock framer-motion (this is fine)
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children }) => <div>{children}</div>,
        li: ({ children }) => <li>{children}</li>,
    },
    AnimatePresence: ({ children }) => <div>{children}</div>,
}));

// Mock lazy-load-image (this is fine)
vi.mock('react-lazy-load-image-component', () => ({
    LazyLoadImage: ({ wrapperClassName, ...props }) => <img {...props} />,
}));