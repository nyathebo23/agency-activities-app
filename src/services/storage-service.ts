import { AGENCIES_KEY, AGENCY_ID_KEY, BUS_DRIVERS_KEY, BUSES_KEY, PAYMENT_METHODS_KEY, TOKEN_KEY, USER_KEY } from "../constants/storage-keys";
import type { Agency } from "../types/models/agency";
import type { Bus } from "../types/models/bus";
import type { BusDriver } from "../types/models/bus-driver";
import type { PaymentMethod } from "../types/models/payment-method";
import type { User } from "../types/models/user";

export function storeToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function storeUser(user: User) {
    const userStr = JSON.stringify(user);
    localStorage.setItem(USER_KEY, userStr);
}

export function removeStoredUser() {
    localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    const user: User = JSON.parse(userStr);
    return user;
}


export function storeAgencyList(agencies: Agency[]) {
    const agenciesStr = JSON.stringify(agencies);
    localStorage.setItem(AGENCIES_KEY, agenciesStr);
}

export function removeAgencyList() {
    localStorage.removeItem(AGENCIES_KEY);
}

export function getStoredAgencyList(): Agency[] | null {
    const agenciesStr = localStorage.getItem(AGENCIES_KEY);
    if (!agenciesStr) return null;
    const agencies: Agency[] = JSON.parse(agenciesStr);
    return agencies;
}

export function storeCurrentAgencyId(agencyId: string) {
    localStorage.setItem(AGENCY_ID_KEY, agencyId);
} 

export function removeCurrentAgencyId() {
    localStorage.removeItem(AGENCY_ID_KEY);
}

export function getStoredCurrentAgencyId(): string | null {
    return localStorage.getItem(AGENCY_ID_KEY);
}

export function storeBusList(buses: Bus[]) {
    const busesStr = JSON.stringify(buses);
    localStorage.setItem(BUSES_KEY, busesStr);
}

export function removeBusList() {
    localStorage.removeItem(BUSES_KEY);
}

export function getStoredBusList(): Bus[] | null {
    const busesStr = localStorage.getItem(BUSES_KEY);
    if (!busesStr) return null;
    const buses: Bus[] = JSON.parse(busesStr);
    return buses;
}

export function storeBusDriverList(busDrivers: BusDriver[]) {
    const busDriversStr = JSON.stringify(busDrivers);
    localStorage.setItem(BUS_DRIVERS_KEY, busDriversStr);
}

export function removeBusDriverList() {
    localStorage.removeItem(BUS_DRIVERS_KEY);
}

export function getStoredBusDriverList(): BusDriver[] | null {
    const busDriversStr = localStorage.getItem(BUS_DRIVERS_KEY);
    if (!busDriversStr) return null;
    const busDrivers: BusDriver[] = JSON.parse(busDriversStr);
    return busDrivers;
}

export function storePaymentMethodList(paymentMethods: PaymentMethod[]) {
    const paymentMethodsStr = JSON.stringify(paymentMethods);
    localStorage.setItem(PAYMENT_METHODS_KEY, paymentMethodsStr);
}

export function removePaymentMethodList() {
    localStorage.removeItem(PAYMENT_METHODS_KEY);
}

export function getStoredPaymentMethodList(): PaymentMethod[] | null {
    const paymentMethodsStr = localStorage.getItem(PAYMENT_METHODS_KEY);
    if (!paymentMethodsStr) return null;
    const paymentMethods: PaymentMethod[] = JSON.parse(paymentMethodsStr);
    return paymentMethods;
}