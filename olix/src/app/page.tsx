// app/page.tsx
import React from 'react';
import { PrismaClient } from '@prisma/client';
import Navigation from './components/navigation';
const prisma = new PrismaClient();



export default async function Home() {
    // Fetch events from your database using Prisma
    const events = await prisma.event.findMany({
        orderBy: {
            date: 'asc', // Ordering events by the nearest date
        },
        take: 5, // Limit to 5 upcoming events
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Navigation />

            <div className="pt-18 p-6">

                <div className="relative ">
                    <img
                        src="/img/students.jpg"
                        alt="Banner"
                        className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <h1 className="text-white text-4xl font-bold">Witamy na UG Events</h1>
                    </div>
                </div>

                <h2 className="text-customColorText customColorText text-2xl font-semibold mb-4">Wybierz wydział</h2>

                <div className="space-y-4">
                    <div className="flex justify-center">
                        <a
                            href="/events/zarzadzanie"
                            className="w-full max-w-xs px-6 py-4 bg-customBlue text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
                        >
                            Wydarzenia z Wydziału Zarządzania
                        </a>
                    </div>


                </div>

                <h2 className="text-customColorText text-2xl font-semibold mt-6 mb-4">Następne Wydarzenia</h2>

                <div className="space-y-4">
                    {events.map((event) => (
                        <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold text-gray-600">{event.title}</h3>
                            <p className="text-gray-600">{event.description}</p>
                            <p className="mt-2 text-sm text-gray-500">Location: {event.location || 'Not specified'}</p>
                            <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
                            <a href={`/events/${event.id}`}
                               className="mt-4 inline-block text-blue-600 hover:text-blue-700">
                                Zobacz szczegóły
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
