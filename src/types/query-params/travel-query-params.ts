import type { TravelType } from "../models/travel";

export type TravelQueryParams = {
    startDateTime?: string;
    endDateTime?: string;
    travelType?: TravelType;
    pageNumber: number;
    pageSize: number;
}