
export const API_BASE_URL = 'http://localhost:5000/';

export const API_ROUTES = {
    LOGIN: `${API_BASE_URL}api/accounts/login-agency/`,
    AGENCY_AGENTS: (agencyId: string) => `api/agencyagents/agency/${agencyId}`,
    PAYMENT_METHODS: `api/paymentmethods/`,
    AGENCIES: `api/agencies/`,
    BUSES: `api/bus/`,
    BUS_DRIVERS: `api/busdrivers/`,
    FUTURE_TRAVELS: (agencyId: string) => `api/travels/future/fromagency/${agencyId}`,
    ONGOING_AND_PAST_TRAVELS: (agencyId: string) => `api/travels/current-past/fromagency/${agencyId}`,
    LOADING_TRAVEL_BUS: (travelId: string) => `api/travels/begin-bus-loading/${travelId}`,
    START_TRAVEL: (travelId: string) =>  `api/travels/start-travel/${travelId}`,
    END_TRAVEL: (travelId: string) => `api/travels/end-travel/${travelId}`,
    CUSTOMERS: `api/customers/`,
    CUSTOMERS_QUERY_SEARCH: `api/customers/search/`,
    AGENCY_TRAVEL_TICKETS: (agencyId: string) => `api/traveltickets/agency/${agencyId}`,
    TRAVEL_TICKETS: `api/traveltickets/`,
    TICKETS_OF_TRAVEL: (travelId: string) => `api/traveltickets/travel/${travelId}`,
    TICKET_REFUND_UPDATE: (refundId: string) => `api/refunds/${refundId}`, 
    MARK_TICKET_USED: (ticketId: string) =>  `api/traveltickets/mark-as-used/${ticketId}`,    
    MARK_TICKET_REFUNDED: `api/traveltickets/mark-as-refunded/`,
}
