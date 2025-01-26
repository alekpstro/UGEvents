'use client';

import React, { useEffect, useState } from 'react';

interface Participant {
    id: number;
    name: string | null;
    email: string;
}

interface ParticipantsListProps {
    eventId: number;
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ eventId }) => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const res = await fetch(`/api/events/${eventId}/participants`);
                if (!res.ok) {
                    throw new Error('Failed to fetch participants');
                }
                const data: Participant[] = await res.json();
                setParticipants(data);
            } catch (error) {
                console.error('Error fetching participants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchParticipants();
    }, [eventId]);

    if (loading) return <p>Loading participants...</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            {participants.length === 0 ? (
                <p>No participants yet.</p>
            ) : (
                <ul className="list-disc pl-5">
                    {participants.map((participant) => (
                        <li key={participant.id}>
                            {participant.name || 'Unknown User'} ({participant.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ParticipantsList;
