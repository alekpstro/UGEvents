import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma';

// uchwycenie wydarzenia fetch
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params; // Await `params` object to extract `id`
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) }, // Convert ID to integer
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json(event); // Return event details
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
    }
}


// Usuń wydarzenie i jego uczestników
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params; // Poczekaj na asynchroniczne params

        // Walidacja parametru ID
        if (!id) {
            return NextResponse.json(
                { error: 'Brak ID wydarzenia w żądaniu' },
                { status: 400 }
            );
        }

        // Usuń powiązanych uczestników
        await prisma.joinedEvent.deleteMany({
            where: { eventId: parseInt(id, 10) },
        });

        // Usuń wydarzenie
        const deletedEvent = await prisma.event.delete({
            where: { id: parseInt(id, 10) },
        });

        return NextResponse.json(
            { message: 'Wydarzenie zostało pomyślnie usunięte!', event: deletedEvent },
            { status: 200 }
        );
    } catch (error) {
        console.error('Błąd podczas usuwania wydarzenia:', error);

        return NextResponse.json(
            { error: 'Wystąpił nieoczekiwany błąd podczas usuwania wydarzenia.' },
            { status: 500 }
        );
    }
}
