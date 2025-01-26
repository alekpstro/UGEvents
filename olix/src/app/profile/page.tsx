"use client";

import React, { useEffect, useState } from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import Navigation from "../components/navigation";
import {User} from "../interface/user"


export default function Profile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (session?.user) {
                    const res = await fetch("/api/profile", {
                        headers: {
                            "user-id": session.user.id || "",
                        },
                    });

                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    } else {
                        console.error("Failed to fetch profile");
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [session]);

    if (status === "loading" || loading) {
        return <div>Loading...</div>;
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Navigation/>
                <div className="text-center">
                    <p className="text-customColorText text-lg font-medium">Musisz być zalogowany żeby przejść do tej zakładki.</p>
                    <button
                        onClick={() => signIn()}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Zaloguj się
                    </button>
                </div>
            </div>
        );
    }

    if (!user) {
        return <div>Nie udało się załadować profilu</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="pt-32 px-6">
                {/* Profile Info */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Dane twojego Profil</h2>
                    <p className="text-gray-600 mt-2">
                        <span className="font-semibold">Imię:</span> {user.name || "Brak"}
                    </p>
                    <p className="text-gray-600">
                        <span className="font-semibold">Email:</span> {user.email}
                    </p>
                </div>

                {/* Logout Button */}
                <div className="mb-6">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                        Wyloguj
                    </button>
                </div>

                {/* Joined Events */}
                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Wydarzenia, w których uczestniczysz</h3>
                    {user?.joinedEvents?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user.joinedEvents.map(({ event }) => (
                                <div key={event.id} className="bg-white shadow-lg rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Data: {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    {event.location && (
                                        <p className="text-sm text-gray-600">Lokalizacja: {event.location}</p>
                                    )}
                                    <a
                                        href={`/events/${event.id}`}
                                        className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                                    >
                                        Zobacz szczegóły
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Nie zapisałeś się na żadne wydarzenia.</p>
                    )}

                </div>

                {/* Created Events */}
                <div>
                    <h3 className="pt-8 text-lg font-bold text-gray-800 mb-4">Wydarzenia, które utworzyłaś/eś</h3>
                    {user?.createdEvents?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {user.createdEvents.map((event) => (
                                <div key={event.id} className="bg-white shadow-lg rounded-lg p-6">
                                    <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Data: {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    {event.location && (
                                        <p className="text-sm text-gray-600">Lokalizacja: {event.location}</p>
                                    )}
                                    <a
                                        href={`/events/${event.id}`}
                                        className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                                    >
                                        Zobacz szczegóły
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">Nie utworzyłaś/eś żadnych wydarzeń.</p>
                    )}
                </div>
            </div>

            </div>
    );
}
