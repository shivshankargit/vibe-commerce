import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { getCart } from '../api';

export default function Navbar() {
    const [count, setCount] = useState(0);
    const location = useLocation();

    const refresh = useCallback(async () => {
        try {
            const res = await getCart();
            setCount(res.data?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
        } catch {
            // no-op
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh, location.pathname]);

    useEffect(() => {
        const handler = () => refresh();
        window.addEventListener('cart:updated', handler);
        return () => window.removeEventListener('cart:updated', handler);
    }, [refresh]);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
            <a
                href="#content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                        focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2
                        focus:shadow-lg focus:ring-2 focus:ring-indigo-500"
            >
                Skip to content
            </a>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold">V</div>
                        <span className="text-2xl font-extrabold text-gray-900">Vibe Commerce</span>
                    </Link>
                    <Link
                        to="/cart"
                        className="relative p-2 rounded-full text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition"
                        aria-label="Open cart"
                    >
                        <ShoppingBagIcon className="h-7 w-7" />
                        {count > 0 && (
                            <span
                                aria-live="polite"
                                className="absolute -right-1 -top-1 rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white"
                            >
                                {count}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    );
}
