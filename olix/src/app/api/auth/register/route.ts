import prisma from '../../../../../utils/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

// POST method dla rejestracji
export async function POST(request: Request) {
    try {
        const body = await request.json(); // Parse JSON from the request body
        const { email, password, name } = body;

        // wymagane pola
        if (!email || !password || !name) {
            return NextResponse.json(
                { message: 'Nie wszystkie wymagane pola zostały uzupełnione' },
                { status: 400 }
            );
        }

        // czy użytkownik już istnieje
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Użytkownik już istnieje' },
                { status: 400 }
            );
        }

        // Hashowanie hasłą
        const hashedPassword = await bcrypt.hash(password, 10);

        // tworzenie nowego usera
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return NextResponse.json(
            { message: 'zarejestrowano użytkownika', user: newUser },
            { status: 201 }
        );
    } catch (error) {
        console.error('Błąd w czasie rejestracji użytkownika:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

//  Handle niewspieranych  methods
export function GET() {
    return NextResponse.json(
        { message: 'Method not allowed' },
        { status: 405 }
    );
}
