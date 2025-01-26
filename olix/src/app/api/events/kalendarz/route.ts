import { NextResponse } from 'next/server';
import prisma from '../../../../../utils/prisma';

// wylistuj wydarzenia
export async function GET(req: Request): Promise<NextResponse> {
    const url = new URL(req.url);
    const label: string | null = url.searchParams.get('label'); // Get label from URL params
    const orderBy: "asc" | "desc" = (url.searchParams.get('orderBy') as "asc" | "desc") || "asc"; // Get date sorting
    const date: string | null = url.searchParams.get('date'); // Get date (day)

    try {
        const filters: {
            labels?: { has: string };
            date?: { gte: Date; lte: Date };
        } = {};


        if (label) {
            filters.labels = { has: label };
        }


        if (date) {
            const dayStart = new Date(date);
            const dayEnd = new Date(date);
            dayEnd.setHours(23, 59, 59, 999); // Set end of the day

            filters.date = {
                gte: dayStart,
                lte: dayEnd,
            };
        }


        const events = await prisma.event.findMany({
            where: filters,
            orderBy: {
                date: orderBy, // Sort by date
            },
        });

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}
