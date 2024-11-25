export type SupportTicket = {
    id: number;
    name: string;
    email: string;
    subject: string;
    description: string;
    status: string;
    category: string;
    secret: string;
    ownerId: number;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    supportTicketThreads: TicketMessage[];
};

export type TicketMessage = {
    id: number;
    message: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    ownerId: number;
    supportTicketId: number;
    staffMember: boolean;
};