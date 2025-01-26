import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "../../../../utils/prisma";
import { authOptions } from "../../../../utils/authOptions";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Nie jesteś zalogowany" }, { status: 401 });
        }

        const userId = parseInt(session.user.id, 10);

        if (isNaN(userId)) {
            return NextResponse.json({ error: "Nieprawidłowe ID użytkownika" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                joinedEvents: {
                    include: { event: true },
                },
                createdEvents: true, // Include events created by the user
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Nie znaleziono użytkownika" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Błąd podczas pobierania profilu" }, { status: 500 });
    }
}
