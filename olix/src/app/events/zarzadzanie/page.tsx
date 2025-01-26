"use client";

import React, { useEffect, useState } from "react";
import Navigation from "../../components/navigation";

interface Event {
    id: number;
    title: string;
    description?: string;
    date: string;
    location?: string;
    creatorId: number;
    labels: string[];
}

const LABELS = [
    { label: "Bankowość i Finanse", color: "bg-blue-500" },
    { label: "Ekonometria", color: "bg-green-500" },
    { label: "Finanse Przedsiębiorstw", color: "bg-purple-500" },
    { label: "Informatyka Ekonomiczna", color: "bg-orange-500" },
    { label: "Inwestycje i Nieruchomości", color: "bg-teal-500" },
    { label: "Marketing", color: "bg-red-500" },
    { label: "Organizacja i Zarządzanie", color: "bg-yellow-500" },
    { label: "Rachunkowość", color: "bg-pink-500" },
    { label: "Statystyka", color: "bg-indigo-500" },
    { label: "Rozwój strategiczny", color: "bg-gray-500" },
    { label: "Zachowania organizacyjne", color: "bg-lime-500" },
];

export default function ZarzadzanieEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [date, setDate] = useState<string>("");

    // Fetching events from API
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const queryParams = new URLSearchParams();
                if (selectedLabel) queryParams.set("label", selectedLabel);
                queryParams.set("orderBy", sortOrder);
                if (date) queryParams.set("date", date); // Dodanie daty do parametrów zapytania

                console.log("Wysyłane parametry:", queryParams.toString()); // Debugowanie

                const res = await fetch(`/api/events/zarzadzanie?${queryParams.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log("Otrzymane wydarzenia:", data); // Debugowanie
                    setEvents(data);
                } else {
                    console.error("Nie udało się pobrać wydarzeń.");
                }
            } catch (error) {
                console.error("Błąd podczas pobierania wydarzeń:", error);
            }
        };

        fetchEvents();
    }, [selectedLabel, sortOrder, date]);

    const resetFilters = () => {
        setSelectedLabel("");
        setSortOrder("asc");
        setDate("");
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />
            <div className="pt-32 p-6 bg-gray-100 min-h-screen">
                <h1 className="text-customColorText font-bold text-center mb-8">
                    Wydarzenia na wydziale zarządzania UG
                </h1>

                {/* Kontrolki filtrowania i sortowania */}
                <div className="text-customColorText flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                    {/* Filtruj po etykiecie */}
                    <div className="mb-4 sm:mb-0">
                        <label htmlFor="labelFilter" className="mr-2 text-sm text-customColorText">
                            Filtruj po etykiecie
                        </label>
                        <select
                            id="labelFilter"
                            className="p-2 border rounded-md"
                            value={selectedLabel}
                            onChange={(e) => setSelectedLabel(e.target.value)}
                        >
                            <option value="">Wybierz etykietę</option>
                            {LABELS.map(({ label }) => (
                                <option key={label} value={label}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sortuj po dacie */}
                    <div className="text-customColorText mb-4 sm:mb-0">
                        <label htmlFor="dateSort" className="mr-2 text-sm text-customColorText">
                            Sortuj po dacie
                        </label>
                        <select
                            id="dateSort"
                            className="p-2 border rounded-md"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                        >
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>
                    </div>

                    {/* Filtruj po dacie */}
                    <div className="mb-4 sm:mb-0">
                        <label htmlFor="dateFilter" className="mr-2 text-sm text-customColorText">
                            Filtruj po dacie
                        </label>
                        <input
                            type="date"
                            id="dateFilter"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="p-2 border rounded-md"
                        />
                    </div>

                    {/* Resetuj filtry */}
                    <button
                        onClick={resetFilters}
                        className="p-2 border rounded-md bg-gray-300 hover:bg-gray-400"
                    >
                        Resetuj filtry
                    </button>
                </div>

                {/* Lista wydarzeń */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length > 0 ? (
                        events.map((event) => (
                            <div key={event.id} className="text-customColorText p-4 bg-white shadow-md rounded-lg">
                                <h2 className="text-lg font-semibold">{event.title}</h2>
                                <p className="text-sm">{event.description}</p>
                                <p className="text-sm text-gray-600 mt-2">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {event.labels.map((label) => (
                                        <span
                                            key={label}
                                            className={`px-2 py-1 text-sm text-white rounded-md ${
                                                LABELS.find((l) => l.label === label)?.color || "bg-gray-500"
                                            }`}
                                        >
                                            {label}
                                        </span>
                                    ))}
                                </div>
                                <a
                                    href={`/events/${event.id}`}
                                    className="mt-4 inline-block text-blue-600 hover:text-blue-700"
                                >
                                    Zobacz szczegóły
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">Nie znaleziono wydarzeń.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
