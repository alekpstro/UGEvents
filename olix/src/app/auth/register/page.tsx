'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from "@/app/components/navigation";

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false); // Control modal visibility
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, name }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message || 'Something went wrong');
                return;
            }

            // Show success modal
            setShowModal(true);
        } catch  {
            setError('Nie udało się zarejestrować, spróbuj ponownie.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false); // Hide modal
        router.push('/auth/signin'); // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation/>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Utwórz konto</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Imię lub pseudonim </label>
                            <input
                                type="text"
                                id="name"
                                className="mt-1 block w-full p-3 border border-gray-300 rounded-md text-gray-600"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

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

                        {/* Password Input */}
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
                            Zarejestruj się
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Już masz konto?{' '}
                        <a href="/auth/signin" className="text-blue-600 hover:text-blue-700">Zaloguj się</a>
                    </p>
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pomyślnie zarejestrowano konto!</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Twoje konto zostało pomyślnie zarejestrowane. Kliknij w przycisk poniżej a przekierujemy ciebie na stronę logowania.
                            </p>
                            <button
                                onClick={handleCloseModal}
                                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
                            >
                                Zaloguj się
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
