export interface Participants {
    id: number;
    name: string | null;
    bic: string;
    shortName: string;
    address: string;
    email: string;
    phoneNumber: string;
    status: 'ACTIVE' | 'INACTIVE';
}
