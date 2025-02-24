'use client';

import { signOut } from "next-auth/react";
import React from "react";

export default function LogoutButton() {
    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" }); // Redirect after logout
    };

    return (
        <button
            onClick={handleLogout}  // Trigger the logout function when the button is clicked
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
            Wyloguj
        </button>
    );
}
