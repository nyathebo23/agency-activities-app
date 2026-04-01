import { useQuery } from "@tanstack/react-query";
import type { TravelQueryParams } from "../types/query-params/travel-query-params";
import type { TravelsPagedResp } from "../types/responses/travels-paged-resp";
import { API_ROUTES } from "../constants/urls";
import { api } from "./api-requests";
import { useEntitiesInfos } from "../context/entities-infos-context";


const fetchTravels = async (url: string, filters: TravelQueryParams) => {
    const response = await api.get<TravelsPagedResp>(url, {
        params: {
            ...filters
        }
    });
    return response.data;
} 


export function useFutureTravels(filters: TravelQueryParams) {
    const { currentAgencyId } = useEntitiesInfos();
    return useQuery({
        queryKey: ['future-travels', filters],
        queryFn: () => fetchTravels(API_ROUTES.FUTURE_TRAVELS(currentAgencyId), filters),
    });
} 

export function useOnGoingOrPastTravels(filters: TravelQueryParams) {
    const { currentAgencyId } = useEntitiesInfos();
    return useQuery({
        queryKey: ['ongoing-past-travels', filters],
        queryFn: () => fetchTravels(API_ROUTES.ONGOING_AND_PAST_TRAVELS(currentAgencyId), filters),
    });
}