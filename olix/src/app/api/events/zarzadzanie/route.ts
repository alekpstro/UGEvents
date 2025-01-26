import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma';
import { Prisma } from '@prisma/client'; // Import typów Prisma

// Obsługa metody GET (lista wszystkich wydarzeń z filtrowaniem i sortowaniem)
export async function GET(req: Request): Promise<NextResponse> {
    const url = new URL(req.url);

    // Pobierz etykietę z parametrów URL
    const label: string | null = url.searchParams.get('label');

    // Pobierz parametr sortowania, domyślnie "asc"
    const sortOrder: "asc" | "desc" = (url.searchParams.get('orderBy') as "asc" | "desc") || "asc";

    // Pobierz datę z parametrów URL
    const date: string | null = url.searchParams.get('date');

    try {
        // Tworzenie warunku WHERE z odpowiednim typem Prisma
        const where: Prisma.EventWhereInput = {};

        // Jeśli etykieta jest podana, dodaj filtrację po etykiecie
        if (label) {
            where.labels = { has: label }; // Filtracja po zawartości tablicy
        }

        // Jeśli data jest podana, dodaj filtrację po dacie
        if (date) {
            const selectedDate = new Date(date); // Parsowanie daty z parametru
            const nextDay = new Date(selectedDate);
            nextDay.setDate(selectedDate.getDate() + 1); // Ustaw kolejny dzień (początek następnego dnia)

            where.date = {
                gte: selectedDate, // Od wybranej daty
                lt: nextDay,       // Do początku następnego dnia (wyłączając go)
            };
        }

        // Pobranie wydarzeń z bazy danych za pomocą Prisma
        const events = await prisma.event.findMany({
            where, // Warunki filtrowania
            orderBy: { date: sortOrder }, // Sortowanie według daty
        });


        return NextResponse.json(events, { status: 200 });
    } catch (error) {

        console.error('Błąd podczas pobierania wydarzeń:', error);


        return NextResponse.json({ error: 'Nie udało się pobrać wydarzeń' }, { status: 500 });
    }
}
