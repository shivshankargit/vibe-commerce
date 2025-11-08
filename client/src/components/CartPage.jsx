// src/components/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, checkout, updateCartQuantity, emitCartUpdated } from '../api';
import toast from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';
import { TrashIcon, PlusIcon, MinusIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal';
import Skeleton from './ui/Skeleton';
import { Link } from 'react-router-dom';

function CartSkeleton() {
    return (
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
            <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/3" />
                            <Skeleton className="h-10 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-12 lg:mt-0">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    );
}

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [receipt, setReceipt] = useState(null);
    const [updatingItemId, setUpdatingItemId] = useState(null);

    useEffect(() => { fetchCart(); }, []);

    const fetchCart = async () => {
        try {
            const res = await getCart();
            setCart(res.data);
        } catch (err) {
            toast.error('Could not fetch cart.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeFromCart(itemId);
            emitCartUpdated();
            toast.success('Item removed.');
            fetchCart();
        } catch (err) {
            toast.error('Failed to remove item.');
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity === 0) {
            handleRemove(itemId);
            return;
        }
        setUpdatingItemId(itemId);
        const toastId = toast.loading('Updating quantity...');
        try {
            await updateCartQuantity(itemId, newQuantity);
            emitCartUpdated();
            await fetchCart();
            toast.success('Quantity updated!', { id: toastId });
        } catch (err) {
            toast.error('Failed to update.', { id: toastId });
        } finally {
            setUpdatingItemId(null);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            const res = await checkout(formData);
            setReceipt(res.data.receipt);
            setCart(null);
            emitCartUpdated();
            setFormData({ name: '', email: '' });
            toast.success('Checkout successful!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Checkout failed.');
        }
    };

    if (loading) return <CartSkeleton />;

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <>
            <AnimatePresence mode="wait">
                {isEmpty ? (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center mt-8 px-5 py-2.5 rounded-md bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        >
                            Browse Products
                        </Link>
                    </motion.div>
                ) : (
                    <motion.div
                        key="cart"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="lg:grid lg:grid-cols-3 lg:gap-12"
                    >
                        {/* Items */}
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Your Cart</h2>
                            <ul className="divide-y divide-gray-200">
                                {cart.items.map((item) => (
                                    <motion.li
                                        key={item._id}
                                        className="flex py-6"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <img
                                            src={item.productId.imageUrl}
                                            alt={item.productId.name}
                                            className="h-24 w-24 rounded-md object-cover"
                                            loading="lazy"
                                        />
                                        <div className="ml-4 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{item.productId.name}</h3>
                                                {/* Quantity controls */}
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                        disabled={updatingItemId === item._id}
                                                        className="p-1.5 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                                                    >
                                                        {item.quantity === 1 ? (
                                                            <TrashIcon className="h-4 w-4 text-red-500" />
                                                        ) : (
                                                            <MinusIcon className="h-4 w-4" />
                                                        )}
                                                    </button>

                                                    <span className="w-8 text-center font-medium">
                                                        {updatingItemId === item._id ? (
                                                            <PulseLoader size={4} color="#4F46E5" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>

                                                    <button
                                                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                        disabled={updatingItemId === item._id}
                                                        className="p-1.5 rounded-full border text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <PlusIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <p className="text-lg font-medium text-gray-900">
                                                    ${(item.productId.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Summary */}
                        <div className="mt-12 lg:mt-0">
                            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-32">
                                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                                <div className="flex justify-between text-lg font-medium text-gray-900 mb-4">
                                    <p>Total</p>
                                    <p>${cart.total}</p>
                                </div>
                                <form onSubmit={handleCheckout} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md shadow-lg font-semibold hover:bg-indigo-700 transition"
                                    >
                                        Checkout
                                    </button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Receipt Modal */}
            <Modal open={!!receipt} onClose={() => setReceipt(null)}>
                {receipt && (
                    <div>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Purchase Complete!</h2>
                        <p className="text-gray-700">Thank you, <span className="font-semibold">{receipt.user.name}</span>.</p>
                        <p className="text-gray-600 mb-4">A receipt has been "sent" to {receipt.user.email}.</p>
                        <div className="bg-gray-100 p-4 rounded-lg mb-6">
                            <h3 className="font-semibold text-gray-800">Order Summary</h3>
                            <p>Total: <span className="font-bold text-lg text-gray-900">${receipt.total}</span></p>
                            <p className="text-sm text-gray-500">Order ID: #{receipt._id || new Date(receipt.timestamp).getTime()}</p>
                        </div>
                        <button
                            onClick={() => setReceipt(null)}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                        >
                            Close
                        </button>
                    </div>
                )}
            </Modal>
        </>
    );
}
