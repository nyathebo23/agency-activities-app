import type { TravelTicket } from "../models/travel-ticket"

export type TicketsPagedResp = {
    items: TravelTicket[],
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}