'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import LogoutButton from './LogoutButton';

export default function Navigation() {

    const [menuOpen, setMenuOpen] = useState(false); // State to toggle the mobile menu



    return (
        <nav className="bg-[#052d73] text-white fixed top-0 left-0 w-full z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center p-4">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold">
                    UG Wydarzenia
                </Link>

                {/* Hamburger Menu  */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="lg:hidden block text-white focus:outline-none"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                        />
                    </svg>
                </button>

                {/* Navigation Linki */}
                <div
                    className={`${
                        menuOpen ? 'flex' : 'hidden'
                    } lg:flex lg:items-center lg:space-x-6 flex-col lg:flex-row absolute lg:static top-16 left-0 w-full bg-[#052d73] lg:bg-transparent lg:w-auto z-40 text-center`}
                >
                    <Link href="/auth/signin" className="block px-4 py-2 hover:bg-blue-600 rounded-md lg:rounded-none">
                        Zaloguj
                    </Link>
                    <Link href="/events/zarzadzanie/create" className="block px-4 py-2 hover:bg-blue-600 rounded-md lg:rounded-none">
                        Utwórz Wydarzenie
                    </Link>
                    <Link href="/events/kalendarz" className="block px-4 py-2 hover:bg-blue-600 rounded-md lg:rounded-none">
                        Kalendarz
                    </Link>
                    <Link href="/events/zarzadzanie" className="block px-4 py-2 hover:bg-blue-600 rounded-md lg:rounded-none">
                        Wydarzenia
                    </Link>
                    <LogoutButton />
                    <Link
                        href="/profile"
                        className="block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 lg:inline-block lg:rounded-none"
                    >
                        Twój profil
                    </Link>
                </div>



            </div>
        </nav>
    );
}
