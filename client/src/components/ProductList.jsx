import React, { useState, useEffect } from 'react';
import { getProducts, addToCart, emitCartUpdated } from '../api';
import toast from 'react-hot-toast';
import { PlusIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from './ui/Skeleton';

function ProductCardSkeleton() {
    return (
        <div className="group relative">
            <Skeleton className="w-full aspect-square" />
            <div className="mt-4 flex justify-between items-center">
                <div className="w-2/3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
            </div>
        </div>
    );
}

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await getProducts();
                if (mounted) setProducts(res.data);
            } catch (err) {
                console.error('Error fetching products:', err);
                toast.error('Could not fetch products.');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const handleAddToCart = async (productId, productName) => {
        setAddingId(productId);
        try {
            await addToCart(productId, 1);
            emitCartUpdated();
            toast.success(`${productName} added to cart!`);
        } catch (err) {
            console.error('Error adding to cart:', err);
            toast.error('Failed to add item.');
        } finally {
            setAddingId(null);
        }
    };

    const Grid = loading
        ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((product, idx) => (
            <motion.div
                key={product._id}
                className="group relative"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
            >
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <LazyLoadImage
                        src={product.imageUrl}
                        alt={product.name}
                        effect="blur"
                        wrapperClassName="w-full h-full"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.name}</h3>
                        <p className="mt-1 text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                    </div>
                    <button
                        onClick={() => handleAddToCart(product._id, product.name)}
                        disabled={addingId === product._id}
                        className="p-2 bg-indigo-600 rounded-full text-white shadow-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <PlusIcon className={`h-5 w-5 ${addingId === product._id ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </motion.div>
        ));

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div id="content" className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {Grid}
            </div>
        </motion.div>
    );
}
