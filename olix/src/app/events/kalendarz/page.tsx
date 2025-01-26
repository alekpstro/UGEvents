"use client";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useRouter } from "next/navigation"; // Import Router
import Navigation from "../../components/navigation";

const localizer = momentLocalizer(moment);

interface Event {
    id: number; // Dodano ID wydarzenia
    title: string;
    start: Date;
    end: Date;
    labels: string;
}

const MyCalendar: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [dailyEvents, setDailyEvents] = useState<Event[]>([]);
    const router = useRouter(); // Hook do nawigacji

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch("/api/events/kalendarz");
                const data: { id: number; title: string; date: string; labels: string }[] = await res.json();
                setEvents(
                    data.map((event) => ({
                        id: event.id, // Ustawienie ID
                        title: event.title,
                        start: new Date(event.date),
                        end: new Date(event.date),
                        labels: event.labels,
                    }))
                );
            } catch (error) {
                console.error("Błąd podczas pobierania wydarzeń:", error);
            }
        };

        fetchEvents();
    }, []);

    const eventStyleGetter = (event: Event) => {
        const style = {
            backgroundColor: event.labels === "important" ? "#ef4444" : "#3b82f6",
            borderRadius: "7px",
            padding: "5px",
            border: "1px solid #ccc",
            color: "white",
            display: "block",
        };

        return { style };
    };

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        const selectedEvents = events.filter((event) =>
            moment(event.start).isSame(slotInfo.start, "day")
        );
        setSelectedDate(slotInfo.start);
        setDailyEvents(selectedEvents);
    };

    const handleEventClick = (id: number) => {
        // Przekierowanie na stronę szczegółów wydarzenia
        router.push(`/events/${id}`);
    };

    return (
        <div className="container mx-auto mt-5 p-5">
            <Navigation />
            <h1 className="pt-24 text-customColorText text-2xl font-bold mb-5 text-center">
                Kalendarz Wydarzeń
            </h1>
            <Calendar<Event>
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "80vh" }}
                eventPropGetter={eventStyleGetter}
                className="shadow-lg border rounded-lg"
                selectable
                onSelectSlot={handleSelectSlot}
            /> {/* wróć tu i popraw */}

            {/* Modal z listą wydarzeń */}
            {selectedDate && (
                <div className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                        <h2 className="text-customColorText text-xl font-bold mb-4">
                            Wydarzenia na {moment(selectedDate).format("DD.MM.YYYY")}
                        </h2>
                        {dailyEvents.length > 0 ? (
                            <ul>
                                {dailyEvents.map((event) => (
                                    <li
                                        key={event.id}
                                        className="text-customColorText mb-2 p-2 bg-blue-100 border-l-4 border-blue-500 rounded cursor-pointer"
                                        onClick={() => handleEventClick(event.id)} // Dodano obsługę kliknięcia
                                    >
                                        <strong>{event.title}</strong>
                                        <p>{event.labels}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Brak wydarzeń tego dnia.</p>
                        )}
                        <button
                            className=" mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                            onClick={() => setSelectedDate(null)}
                        >
                            Zamknij
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCalendar;
