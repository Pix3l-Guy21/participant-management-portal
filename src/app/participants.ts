export interface Participants {
    id: number;
    name: string | null;
    bic: string;
    shortName: string;
    email: string;
    phoneNumber: string;
    status: 'ACTIVE' | 'INACTIVE';
}
