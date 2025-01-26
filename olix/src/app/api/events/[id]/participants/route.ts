import { NextResponse } from 'next/server';
import prisma from '../../../../../../utils/prisma';


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const { id } = await params; // Używamy await, aby czekać na wynik Promise
        const eventId = parseInt(id); // Konwertujemy ID na liczbę całkowitą

        // Pobieramy uczestników wydarzenia z bazy danych
        const participants = await prisma.joinedEvent.findMany({
            where: { eventId },
            include: { user: true }, // Dołączamy informacje o użytkowniku
        });

        // Formatujemy uczestników
        const formattedParticipants = participants.map((p) => ({
            id: p.user.id,
            name: p.user.name,
            email: p.user.email,
        }));

        // Zwracamy sformatowaną odpowiedź
        return NextResponse.json(formattedParticipants, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas załadowania uczestników wydarzenia:', error);
        // Zwracamy błąd 500, jeśli wystąpił problem z zapytaniem
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
