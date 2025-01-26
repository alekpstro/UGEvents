
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '../../../../../../utils/prisma';

export async function POST(req: Request, { params }: { params: Record<string, string> }) {
    const resolvedParams = await params;


    if (!resolvedParams || !resolvedParams.id) {
        return NextResponse.json({ message: 'Invalid parameters' }, { status: 400 });
    }

    console.log('Resolved params:', resolvedParams); // Debugging log

    const session = await getServerSession(authOptions);

    // Zwróć to jeżeli user jest niezalogowany
    if (!session || !session.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const eventId = parseInt(resolvedParams.id, 10); // Accessing the resolved param id
    const userId = parseInt(session.user.id, 10);

    try {
        // czy user już uczestniczy w innym wydarzeniu
        const existing = await prisma.joinedEvent.findFirst({
            where: { userId, eventId },
        });

        if (existing) {
            return NextResponse.json({ message: 'Już uczestniczysz w tym wydarzeniu.' }, { status: 400 });
        }

        // dodanie usera do wydarzenia
        await prisma.joinedEvent.create({
            data: { userId, eventId },
        });

        return NextResponse.json({ message: 'Udało ci się dołączyć do wydarzenia.' }, { status: 200 });
    } catch (error) {
        console.error('Błąd podczas próby dołączenia do wydarzenia:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
