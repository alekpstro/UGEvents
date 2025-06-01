'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {useParams} from "next/navigation";
import Navigation from "../../../components/navigation";

export default function JoinEvent() {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();

    useEffect(() => {
        if (!id) {
            setError('Invalid event ID.');
        }
    }, [id]);
    const handleJoinEvent = async () => {
        if (!session) {
            setError('Aby dołączyć do wydarzenia musisz być zalogowany');
            return;
        }
        try {
            setLoading(true);
            setError('');
            const res = await fetch(`/api/events/${id}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to join event');
            }
            router.push(`/events/${id}/participants`);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Navigation/>
            <h1 className=" text-3xl font-bold mb-6 text-customColorText">Dołącz do wydarzenia !</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
                onClick={handleJoinEvent}
                disabled={loading}
                className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
                {loading ? 'Joining...' : 'Dołącz'}
            </button>

            <div className={" pt-8 flex flex-col items-center justify-center"}>
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                    onClick={() => router.push(`/events/${id}`)}
                >
                    Powróć do szczegółów wydarzenia

                </button>
            </div>
        </div>
    );
}
