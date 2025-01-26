import { NextResponse } from 'next/server';
import prisma from '../../../../../../utils/prisma';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log('Received payload:', body); // Logowanie payloadu do debugowania

        const { title, description, labels, date, location, creatorId } = body;

        // wymagane pola
        if (!title || !date || !location || !creatorId) {
            return NextResponse.json(
                { error: 'Brakuje wymaganych pól: title, date, location, or creatorId' },
                { status: 400 }
            );
        }

        // upewnij sie że  creatorId to numer
        const creatorIdNumber = Number(creatorId);
        if (isNaN(creatorIdNumber)) {
            return NextResponse.json(
                { error: 'Invalid creatorId. Must be a number.' },
                { status: 400 }
            );
        }

        // czy data jest poprawna
        if (new Date(date).toString() === 'Invalid Date') {
            return NextResponse.json(
                { error: 'niepoprawny format daty, popraw.' },
                { status: 400 }
            );
        }

        // Ensure labels is an array of strings
        const labelArray: string[] = Array.isArray(labels) ? labels : [labels];

        // Create event in the database
        const newEvent = await prisma.event.create({
            data: {
                title,
                description: description || '',
                date: new Date(date),
                location,
                creatorId: creatorIdNumber,
                labels: labelArray,
            },
        });

        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'nie udało się utworzyć wydarzenia' }, { status: 500 });
    }
}
