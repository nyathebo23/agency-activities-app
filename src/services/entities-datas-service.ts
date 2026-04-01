import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "./api-requests";
import type { PaymentMethod } from "../types/models/payment-method";
import { API_ROUTES } from "../constants/urls";
import type { BusDriver } from "../types/models/bus-driver";
import type { Bus } from "../types/models/bus";
import type { Agency } from "../types/models/agency";
import { useEntitiesInfos } from "../context/entities-infos-context";
import type { AgencyAgent } from "../types/models/agency-agent";

export function useAgencyAgentsList() {
    const { currentAgencyId } = useEntitiesInfos();
    return useQuery({
        queryKey: ['agency-agents'],
        queryFn: async () => {
            const resp = await api.get<AgencyAgent[]>(API_ROUTES.AGENCY_AGENTS(currentAgencyId));
            return resp.data;
        }
    })
}

export function usePaymentMethods() {
    return useQuery({
        queryKey: ['payment-method'],
        queryFn: async () => {
            const response = await api.get<PaymentMethod[]>(API_ROUTES.PAYMENT_METHODS);
            return response.data;
        }
    })
}

export function useBusDrivers() {
    return useQuery({
        queryKey: ['bus-driver'],
        queryFn: async () => {
            const response = await api.get<BusDriver[]>(API_ROUTES.BUS_DRIVERS);
            return response.data;
        }
    })
}

export function useBuses() {
    return useQuery({
        queryKey: ['bus'],
        queryFn: async () => {
            const response = await api.get<Bus[]>(API_ROUTES.BUSES);
            return response.data;
        }
    })
}

export function useAgencies() {
    return useQuery({
        queryKey: ['agency'],
        queryFn: async () => {
            const agencies = await api.get<any[]>(API_ROUTES.AGENCIES)
            .then((resp) => resp.data.map(item => { 
                return {
                    id: item.id,
                    locationDesc: item.locationDesc,
                    city: item.city.name,
                    quarter: item.quarter
                } as Agency
            }));
            return agencies;
        }
    })
}

export function useEntitiesDatas(enabled: boolean) {
    return useQueries({
        queries: [
            {
                queryKey: ['agency'],
                queryFn: async () => {
                    const agencies = await api.get<any[]>(API_ROUTES.AGENCIES)
                    .then((resp) => resp.data.map(item => { 
                        return {
                            id: item.id,
                            locationDesc: item.locationDesc,
                            city: item.city.name,
                            quarter: item.quarter
                        } as Agency
                    }));
                    return agencies;
                },
                enabled: enabled
            },
            {
                queryKey: ['bus'],
                queryFn: async () => {
                    const response = await api.get<Bus[]>(API_ROUTES.BUSES);
                    return response.data;
                },
                enabled: enabled
            },
            {
                queryKey: ['bus-driver'],
                queryFn: async () => {
                    const response = await api.get<BusDriver[]>(API_ROUTES.BUS_DRIVERS);
                    return response.data;
                },
                enabled: enabled
            },
            {
                queryKey: ['payment-method'],
                queryFn: async () => {
                    const response = await api.get<PaymentMethod[]>(API_ROUTES.PAYMENT_METHODS);
                    return response.data;
                },
                enabled: enabled
            }
        ]
    })
}