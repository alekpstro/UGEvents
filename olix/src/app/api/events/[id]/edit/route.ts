import { NextResponse } from 'next/server';
import prisma from '../../../../../../utils/prisma';


export async function PATCH(req: Request, context: { params: { id: string } }): Promise<NextResponse> {
    try {
        // Czekamy na rozpakowanie params
        const { params } = await Promise.resolve(context);
        const id: number = parseInt(params.id, 10);

        if (isNaN(id)) {
            console.error('Niepoprawny ID wydarzenia:', params.id);
            return NextResponse.json({ error: 'Niepoprawny ID wydarzenia' }, { status: 400 });
        }

        // Parsowanie JSON z requestu
        const body = await req.json();
        console.log('Request body:', body);

        const { title, description, date, location, labels } = body;

        // Walidacja pól
        if (!title || !description || !date || !location || !Array.isArray(labels)) {
            console.error('Invalid payload:', body);
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Aktualizacja wydarzenia w bazie danych
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title,
                description,
                date: new Date(date),
                location,
                labels,
            },
        });

        console.log('wydarzenie zostało zmodyfikowane:', updatedEvent);
        return NextResponse.json(updatedEvent, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas edycji wydarzenia:', error);
        return NextResponse.json({ error: 'Nie udało się zaktualizować wydarzenia' }, { status: 500 });
    }
}
