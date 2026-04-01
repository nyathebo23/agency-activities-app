export type User = {
    id: string;
    username: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
    role: ROLE;
    enabled: boolean;
}

export const ROLE = {
    AGENCYAGENT: "AgencyAgent",
    AGENCYADMIN: "AgencyAdmin",
    BUSDRIVER: "BusDriver"
} as const;

export type ROLE = typeof ROLE[keyof typeof ROLE];