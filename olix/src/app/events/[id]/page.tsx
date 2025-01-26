'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from "@/app/components/navigation";
import { useSession } from 'next-auth/react'; // To get the logged-in user's session

interface Participant {
    id: number;
    name: string | null;
}

interface Event {
    id: number;
    title: string;
    description?: string;
    labels: string;
    date: string; // ISO Date String
    location?: string;
    creatorId: number;
}

const EventPage = () => {
    const { id } = useParams(); // Extract event ID from URL
    const router = useRouter(); // Router for navigation
    const { data: session } = useSession(); // Get logged-in user session
    const [event, setEvent] = useState<Event | null>(null); // Event details
    const [participants, setParticipants] = useState<Participant[]>([]); // List of participants
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error message
    const [deleting, setDeleting] = useState(false); // Delete state

    // Fetch event details and participants
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch event details
                const eventResponse = await fetch(`/api/events/${id}`);
                if (!eventResponse.ok) {
                    throw new Error('Nie udało się załadować szczegółów wydarzenia');
                }
                const eventData: Event = await eventResponse.json();
                setEvent(eventData);

                // Fetch participants
                const participantsResponse = await fetch(`/api/events/${id}/participants`);
                if (!participantsResponse.ok) {
                    throw new Error('Nie udało się pobrać listy uczestników wydarzenia');
                }
                const participantsData: Participant[] = await participantsResponse.json();
                setParticipants(participantsData);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Obsługa usuwania wydarzenia
    const handleDelete = async () => {
        if (!confirm('Czy na pewno chcesz usunąć to wydarzenie?')) return;

        setDeleting(true);

        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage =
                    errorData?.error || `Nie udało się usunąć wydarzenia: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data = await response.json();
            alert(data?.message || 'Wydarzenie zostało usunięte pomyślnie!');
            router.push('/events/zarzadzanie');
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Wystąpił nieznany błąd podczas usuwania wydarzenia';
            alert(`Błąd: ${message}`);
        } finally {
            setDeleting(false);
        }
    };




    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!event) {
        return <div className="text-center text-gray-500 mt-10">Event not found!</div>;
    }

    // Check if the logged-in user is the creator
    const isCreator: boolean = session?.user?.id === event.creatorId.toString();


    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-16">
                <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">{event.title}</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Opis</label>
                            <p className="mt-1 text-gray-700">{event.description || 'No description provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Etykieta</label>
                            <p className="mt-1 text-gray-700">{event.labels || 'No description provided'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data</label>
                            <p className="mt-1 text-gray-700">
                                {event.date ? new Date(event.date).toLocaleString() : 'No date provided'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Lokalizacja</label>
                            <p className="mt-1 text-gray-700">{event.location || 'No location provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">ID twórcy wydarzenia</label>
                            <p className="mt-1 text-gray-700">{event.creatorId || 'Unknown'}</p>
                        </div>

                        {/* Join Event Button */}
                        <div className="text-center mt-6">
                            <button
                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                                onClick={() => router.push(`/events/${id}/join`)}
                            >
                                Dołącz do wydarzenia
                            </button>
                        </div>

                        {/* Edit and Delete Buttons (Visible only to creator) */}
                        {isCreator && (
                            <div className="text-center mt-6 flex gap-4">
                                <button
                                    className="w-full bg-yellow-500 text-white py-3 rounded-md hover:bg-yellow-600 transition duration-300"
                                    onClick={() => router.push(`/events/${id}/edit`)}
                                >
                                    Edytuj wydarzenie
                                </button>
                                <button
                                    className={`w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition duration-300 ${
                                        deleting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    onClick={handleDelete}
                                    disabled={deleting}
                                >
                                    {deleting ? 'Deleting...' : 'Usuń wydarzenie'}
                                </button>
                            </div>
                        )}

                        {/* Participants List */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Uczestnicy wydarzenia</h2>
                            {participants.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {participants.map((participant) => (
                                        <li key={participant.id} className="text-gray-700">
                                            {participant.name || 'Unknown'}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">To wydarzenie jeszcze nie ma uczestników.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
