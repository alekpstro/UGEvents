"use client";

import { signIn } from 'next-auth/react';
import '../../../app/globals.css';
import React, { useState } from "react";
import Navigation from "@/app/components/navigation";
import { useRouter } from "next/navigation";

export default function Page() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Modal state
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
        } else {
            // Show the success modal
            setShowModal(true);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        // Redirect to the home page after closing the modal
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Zaloguj się</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Email Input */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adres Email</label>
                            <input
                                type="email"
                                id="email"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md text-gray-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password  */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Hasło</label>
                            <input
                                type="password"
                                id="password"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md text-gray-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Zaloguj
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Nie masz konta? <a href="/auth/register" className="text-blue-600 hover:text-blue-700">Zarejestruj się</a>
                    </p>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold text-gray-800">Udało się zalogować</h2>
                        <p className="mt-4 text-gray-600">Zostałeś pomyślnie zalogowany!</p>
                        <div className="mt-6 flex justify-end">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
                                onClick={handleModalClose}
                            >
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
