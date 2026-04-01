import type { TicketsPagedResp } from "../types/responses/tickets-paged-resp";
import { API_ROUTES } from "../constants/urls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TravelTicket } from "../types/models/travel-ticket";
import type { TicketRefundSchema } from "../types/schemas/ticket-refund-schema";
import type { TicketRefund } from "../types/models/ticket-refund";
import type { RefundUpdateSchema } from "../types/schemas/refund-update-schema";
import { api } from "./api-requests";
import type { TicketQueryParams } from "../types/query-params/ticket-query-params";
import type { TravelTicketSchema } from "../types/schemas/travel-ticket-schema";

const fetchTickets = async (filters: TicketQueryParams, currentAgencyId: string) => {
    const response = await api.get<TicketsPagedResp>(API_ROUTES.AGENCY_TRAVEL_TICKETS(currentAgencyId), {
        params: {
            ...filters        
        }
    });
    return response.data;
}  

export function useAgencyTickets(filters: TicketQueryParams, currentAgencyId: string) {
    return useQuery({
        queryKey: ['agency-tickets', filters],
        queryFn: () => fetchTickets(filters, currentAgencyId),
    });
}

export function useTicketsOfTravel(travelId: string | null) {
    return useQuery({
        queryKey: ['tickets-of-travel', travelId],
        queryFn: async () => {
            const response = await api.get<TravelTicket[]>(API_ROUTES.TICKETS_OF_TRAVEL(travelId!));
            return response.data;
        },
        enabled: !!travelId
    });
}

export function useCreateTicket() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: TravelTicketSchema) => {
            const response = await api.post<TravelTicket>(API_ROUTES.TRAVEL_TICKETS, data);
            return response.data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['tickets-of-travel']}),
                queryClient.invalidateQueries({ queryKey: ['agency-tickets']})
            ]);                 
        }
    });
}

export function useUpdateTicket(ticketId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: TravelTicketSchema) => {
            const response = await api.put<TravelTicket>(API_ROUTES.TRAVEL_TICKETS + ticketId, data);
            return response.data;
        },
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['tickets-of-travel']}),
                queryClient.invalidateQueries({ queryKey: ['agency-tickets']})
            ]);            
        }
    });
}

export function useCreateTicketRefund() {
    return useMutation({
        mutationFn: async (data: TicketRefundSchema) => {
            const response = await api.post<TicketRefund>(API_ROUTES.MARK_TICKET_REFUNDED, data);
            return response.data;
        }
    });
}


export function useUpdateTicketRefund(refundId: string) {
    return useMutation({
        mutationFn: async (data: RefundUpdateSchema) => {
            const response = await api.put<TicketRefund>(API_ROUTES.TICKET_REFUND_UPDATE(refundId), data);
            return response.data;
        }
    });   
}

export function useMarkTicketUsed() {
    return useMutation({
        mutationFn: async (ticketId: string) => {
            const response = await api.post<string>(API_ROUTES.MARK_TICKET_USED(ticketId));
            return response.data;
        }
    })    
}

