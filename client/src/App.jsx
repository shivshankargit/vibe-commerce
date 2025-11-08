// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';

const ProductList = lazy(() => import('./components/ProductList'));
const CartPage = lazy(() => import('./components/CartPage'));

function Page({ children }) {
  return (
    <motion.main
      id="content"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.main>
  );
}

function RoutesWithAnimation() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <Page>
              <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading…</div>}>
                <ProductList />
              </Suspense>
            </Page>
          }
        />
        <Route
          path="/cart"
          element={
            <Page>
              <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading cart…</div>}>
                <CartPage />
              </Suspense>
            </Page>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 2200,
          style: {
            background: '#ffffffcc',
            backdropFilter: 'blur(8px)',
            border: '1px solid #e5e7eb',
            color: '#111827',
            padding: '8px 14px',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: {
              primary: '#4F46E5',
              secondary: 'white',
            }
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: 'white',
            }
          }
        }}
      />
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <Navbar />
        <RoutesWithAnimation />
      </div>
    </Router>
  );
}
