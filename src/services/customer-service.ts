import { useMutation, useQuery } from "@tanstack/react-query";
import type { CustomerSchemaOutput } from "../types/schemas/customer-schema";
import { API_ROUTES } from "../constants/urls";
import { api } from "./api-requests";
import type { Customer } from "../types/models/customer";
import type { CustomerQueryParams } from "../types/query-params/customer-query-params";

export function useCreateCustomer() {
    return useMutation({
        mutationFn: async (data: CustomerSchemaOutput) => {
            const response = await api.post<Customer>(API_ROUTES.CUSTOMERS, {
                ...data, 
                dateBirth: data.dateBirth?.toISOString().split('T')[0]
            });
            return {
                    id: response.data.id,
                    dateBirth: new Date(response.data.dateBirth),
                    user: response.data.user
                } as Customer;
        }
    }) 
}

export function useCustomersQueryList(queryParams: CustomerQueryParams | null) {
    return useQuery({
        queryKey: ['customers-query-search', queryParams],
        queryFn: async () => {
            const response = await api.get<Customer[]>(API_ROUTES.CUSTOMERS_QUERY_SEARCH, {
                params: {
                    ...queryParams
                }
            });
            return response.data.map(item => {
                return {
                    id: item.id,
                    dateBirth: new Date(item.dateBirth),
                    user: item.user
                } as Customer
            } );
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        enabled: !!queryParams
    });
}