import type { Travel } from "../models/travel"

export type TravelsPagedResp = {
    items: Travel[],
    pageNumber: number,
    pageSize: number,
    totalCount: number,
    totalPages: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean
}