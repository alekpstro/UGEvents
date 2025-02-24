
export interface User {
    id: number;
    email: string;
    name: string | null;
    joinedEvents: {
        event: {
            id: number;
            title: string;
            date: string;
            location: string | null;
        };
    }[];
    createdEvents: {
        id: number;
        title: string;
        date: string;
        location: string | null;
    }[];
}
