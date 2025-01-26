'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navigation from "./navigation";

interface Participant {
    id: number;
    name: string | null;
}

interface Event {
    id: number;
    title: string;
    description?: string;
    labels: string; // Zmieniono na String
    date: string; // ISO Date String
    location?: string;
    creatorId: number;
}

const EventPage = () => {
    const { id } = useParams(); // Extract event ID from URL
    const router = useRouter(); // Router for navigation
    const [event, setEvent] = useState<Event | null>(null); // Event details
    const [participants, setParticipants] = useState<Participant[]>([]); // List of participants
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error message

    // Fetch event details and participants
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch event details
                const eventResponse = await fetch(`/api/events/${id}`);
                if (!eventResponse.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const eventData: Event = await eventResponse.json();
                console.log(eventData); // Log event data to check it
                setEvent(eventData);

                // Fetch participants
                const participantsResponse = await fetch(`/api/events/${id}/participants`);
                if (!participantsResponse.ok) {
                    throw new Error('Failed to fetch participants');
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

    if (loading) {
        return <div className="text-center text-gray-500 mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    if (!event) {
        return <div className="text-center text-gray-500 mt-10">Event not found!</div>;
    }

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
                            <p className="mt-1 text-gray-700">{event.labels || 'No label provided'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Data</label>
                            <p className="mt-1 text-gray-700">
                                {event.date ? new Date(event.date).toLocaleString() : 'No date provided'}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <p className="mt-1 text-gray-700">{event.location || 'No location provided'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Creator ID</label>
                            <p className="mt-1 text-gray-700">{event.creatorId || 'Unknown'}</p>
                        </div>

                        {/* Join Event Button */}
                        <div className="text-center mt-6">
                            <button
                                className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
                                onClick={() => router.push(`/events/${id}/join`)}
                            >
                                Join the Event
                            </button>
                        </div>

                        {/* Participants List */}
                        <div className="mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Participants</h2>
                            {participants.length > 0 ? (
                                <ul className="list-disc list-inside">
                                    {participants.map((participant) => (
                                        <li key={participant.id} className="text-gray-700">
                                            {participant.name || 'Unknown'}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No participants yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPage;
