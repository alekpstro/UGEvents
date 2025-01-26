'use client';

import React, { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation'; // Importuj hook useParams z Next.js
import Navigation from "../../../components/navigation";


interface Participant {
    id: number;
    name: string | null;
    email: string;
}

export default function ParticipantsPage() {
    const { id } = useParams(); // Uzyskujemy parametry z URL (np. id wydarzenia)
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter(); // Router for navigation

    useEffect(() => {
        if (!id) return; // Sprawdzamy, czy id istnieje, zanim rozpoczniemy pobieranie danych

        const fetchParticipants = async () => {
            try {
                const res = await fetch(`/api/events/${id}/participants`);
                if (!res.ok) {
                    throw new Error('Failed to fetch participants.');
                }
                const data = await res.json();
                setParticipants(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [id]); // Uzależniamy pobieranie od zmiany id



    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <Navigation/>
            <h1 className="pt-32 text-3xl font-bold mb-6 text-customColorText text-center">
                Event Participants
            </h1>
            {participants.length > 0 ? (
                <ul className="bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto">
                    {participants.map((participant) => (
                        <li key={participant.id} className="py-2 border-b border-gray-200 last:border-b-0">
                            <p className="text-gray-800 font-semibold">{participant.name || participant.email}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500">No participants yet.</p>
            )}
            <div className={" pt-32 flex flex-col items-center justify-center"}>
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                    onClick={() => router.push(`/events/${id}`)}
                >
                    Powróc do szczegółów wydarzenia

                </button>
            </div>
        </div>
    );
}
