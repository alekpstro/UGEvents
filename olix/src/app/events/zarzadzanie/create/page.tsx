'use client';

import Confetti from "../../../components/Confetti";
import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navigation from "../../../components/navigation";
import Toolbar from "../../../components/Toolbar";

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

export default function CreateEvent() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [location] = useState('Wydział Zarządzania');
    const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Navigation />
                <div className="text-center text-customColorText">
                    <p className="text-lg font-medium">Aby utworzyć nowe wydarzenie, musisz być zalogowany.</p>
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

    const toggleLabel = (label: string) => {
        setSelectedLabels(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!session?.user?.id) {
            setError("User ID is missing. Please log in again.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/events/zarzadzanie/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    date,
                    location,
                    labels: selectedLabels,
                    creatorId: session.user.id,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || 'Coś poszło nie tak');
                setIsLoading(false);
                return;
            }

            setSuccess('Udało się utworzyć wydarzenie!');
            setTitle('');
            setDescription('');
            setDate('');
            setSelectedLabels([]);
            router.push('/events/zarzadzanie');
        } catch {
            setError('Nie udało się utworzyć wydarzenia. Proszę spróbuj ponownie');
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
                        Utwórz nowe wydarzenie
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
                            <Toolbar onContentChange={handleContentChange} initialContent={description} />
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
                                readOnly
                                className="w-full mt-1 p-3 border rounded-md bg-gray-200 text-customColorText cursor-not-allowed"
                            />
                        </div>
                        <label className="block text-sm font-medium text-customColorText">
                            Etykiety
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {LABELS.map((label) => (
                                <div
                                    key={label.name}
                                    className={`flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer ${
                                        selectedLabels.includes(label.name) ? label.color : "bg-gray-200"
                                    }`}
                                    onClick={() => toggleLabel(label.name)}
                                >
                                    <span className={selectedLabels.includes(label.name) ? 'text-white' : 'text-black'}>
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
                            {isLoading ? 'Tworzenie...' : 'Utwórz wydarzenie'}
                        </button>
                    </form>
                    {success && <Confetti />}
                </div>
            </div>
        </div>
    );
}
