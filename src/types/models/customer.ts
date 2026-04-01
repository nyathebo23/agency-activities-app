import type { User } from "./user";

export type Customer = {
    id: string;
    user: User;
    dateBirth: Date
}