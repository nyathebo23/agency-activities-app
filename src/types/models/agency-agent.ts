import type { User } from "./user";

export type AgencyAgent = {
    id: string;
    user: User;
    agencyId: string
}