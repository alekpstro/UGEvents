'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Navigation from '../../../components/navigation';
import Confetti from "../../../components/Confetti";
import Toolbar from '../../../components/Toolbar';

const LABELS = [
    { name: "Bankowość i Finanse", color: "bg-blue-500" },
    { name: "Ekonometria", color: "bg-green-500" },
    { name: "Finanse Przedsiębiorstw", color: "bg-purple-500" },
    { name: "Informatyka Ekonomiczna", color: "bg-red-500" },
    { name: "Inwestycje i Nieruchomości", color: "bg-yellow-500" },
    { name: "Marketing", color: "bg-pink-500" },
    { name: "Organizacja i Zarządzanie", color: "bg-indigo-500" },
    { name: "Rachunkowość", color: "bg-gray-500" },
    { name: "Statystyka", color: "bg-teal-500" },
    { name: "Rozwój strategiczny", color: "bg-orange-500" },
    { name: "Zachowania organizacyjne", color: "bg-lime-500" },
];

export default function EditEvent() {
    const { status } = useSession();
    const router = useRouter();
    const params = useParams(); // Używamy useParams do obsługi parametrów trasy.

    const [eventId, setEventId] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location, setLocation] = useState('');
    const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    ;


    // Rozpakowujemy params za pomocą useEffect
    useEffect(() => {
        const fetchParams = async () => {
            const resolvedParams = await params; // Rozpakowujemy obiekt params
            const id = Array.isArray(resolvedParams.id) ? resolvedParams.id[0] : resolvedParams.id; // Obsługa string[]
            setEventId(id ?? null); // Obsługa undefined jako null
        };

        fetchParams();
    }, [params]);


    useEffect(() => {
        if (eventId) {
            // Fetch existing event details
            const fetchEvent = async () => {
                try {
                    const res = await fetch(`/api/events/${eventId}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch event details');
                    }

                    const data = await res.json();
                    setTitle(data.title);
                    setDescription(data.description);
                    setDate(new Date(data.date).toISOString().slice(0, 16)); // Format for input datetime-local
                    setLocation(data.location);
                    setSelectedLabel(data.labels?.[0] || null); // Allow only one label
                } catch {
                    setError('Nie udało się pobrać szczegółów wydarzenia');
                }
            };

            fetchEvent();
        }
    }, [eventId]);

    if (status === 'unauthenticated') {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Navigation />
                <div className="text-center text-customColorText">
                    <p className="text-lg font-medium">Musisz być zalogowany, aby edytować wydarzenie.</p>
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

    const handleLabelSelect = (label: string) => {
        setSelectedLabel((prev) => (prev === label ? null : label)); // Allow only one label
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch(`/api/events/${eventId}/edit`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    location,
                    labels: selectedLabel ? [selectedLabel] : [], // Ustaw wybraną etykietę
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Wystąpił problem podczas edycji wydarzenia');
                setIsLoading(false);
                return;
            }

            const updatedEvent = await res.json();
            console.log('Updated event:', updatedEvent);
            setSuccess('Wydarzenie zostało zaktualizowane!');
            router.push(`/events/${eventId}`); // Przekierowanie po aktualizacji
        } catch (error) {
            console.error('Error submitting form:', error);
            setError('Nie udało się zaktualizować wydarzenia. Spróbuj ponownie.');
        } finally {
            setIsLoading(false);
        }
    };
    const handleContentChange = (content: string) => {
        setDescription(content);
    };


    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="pt-32 flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
                    <h1 className="text-2xl font-semibold text-center text-customColorText mb-6">
                        Edytuj wydarzenie
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-customColorText">
                                Tytuł wydarzenia
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-customColorText">
                                Opis
                            </label>
                            {description && <Toolbar onContentChange={handleContentChange} initialContent={description}/>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-customColorText">
                                Data
                            </label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-customColorText">
                                Lokalizacja
                            </label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                            />
                        </div>
                        <label className="block text-sm font-medium text-customColorText">
                            Etykieta
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {LABELS.map((label) => (
                                <div
                                    key={label.name}
                                    className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer ${
                                        selectedLabel === label.name ? label.color : 'bg-gray-200'
                                    }`}
                                    onClick={() => handleLabelSelect(label.name)}
                                >
                                    <span
                                        className={`${
                                            selectedLabel === label.name ? 'text-white' : 'text-black'
                                        }`}
                                    >
                                        {label.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {success && <p className="text-green-500 text-sm">{success}</p>}
                        <button
                            type="submit"
                            className={`w-full bg-blue-600 text-white py-3 rounded-md ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Aktualizowanie...' : 'Zapisz zmiany'}
                        </button>
                    </form>
                    {success && <Confetti />}
                </div>
            </div>
        </div>
    );
}
