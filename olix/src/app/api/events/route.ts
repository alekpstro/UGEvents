import { NextResponse } from 'next/server';
import prisma from '../../../../utils/prisma';


export async function DELETE(req: Request, context: { params: { id: string } }) {
    const { id } = context.params; // Pobieranie ID wydarzenia z kontekstu

    if (!id) {
        return NextResponse.json({ error: 'Missing event ID in request' }, { status: 400 });
    }

    try {
        // Sprawdzenie, czy wydarzenie istnieje
        const event = await prisma.event.findUnique({
            where: { id: Number(id) },
        });

        if (!event) {
            return NextResponse.json({ error: 'Nie znaleziono wydarzenia' }, { status: 404 });
        }

        // Usuwanie wydarzenia
        await prisma.event.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ message: 'Pomyślne usunięcie wydarzenia' }, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas usuwania wydarzenia:', error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}
