import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';


export default function Modal({ open, onClose, children }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50" onClick={onClose} />
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ y: 24, scale: 0.98, opacity: 0 }}
                        animate={{ y: 0, scale: 1, opacity: 1 }}
                        exit={{ y: 24, scale: 0.98, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                    >
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}