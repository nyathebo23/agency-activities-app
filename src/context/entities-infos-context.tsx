import { createContext, useContext, type ReactNode } from "react";
import { getStoredAgencyList, getStoredBusDriverList, getStoredBusList, getStoredCurrentAgencyId, getStoredPaymentMethodList } from "../services/storage-service";
import type { EntitiesInfosContextType } from "./types/entities-infos-context-type";

const EntitiesInfosContext = createContext<EntitiesInfosContextType | null>(null);


export const EntitiesInfosProvider = ({children}: {children: ReactNode}) => {
    const agenciesStrMap = new Map<string, string>();
    const agencyList = getStoredAgencyList() ?? [];
    for (const agency of agencyList) {
        agenciesStrMap.set(agency.id, agency.city + ', ' + agency.quarter + ' - ' + agency.locationDesc);
    }
    const busList = getStoredBusList() ?? [];
    const busStringMap = new Map<string, string>();
    for (const bus of busList) {
        busStringMap.set(bus.id, bus.brand + ', ' + bus.serialNumber + ' - ' + bus.capacity);
    }
    const busDriverList = getStoredBusDriverList() ?? []
    const busdriversStringMap = new Map<string, string>();
    for (const busDriver of busDriverList) {
        busdriversStringMap.set(busDriver.id, (busDriver.user.lastname ?? '') + ' ' + (busDriver.user.firstname ?? ''));
    }    
    const value: EntitiesInfosContextType = {
        agencyList: agencyList,
        currentAgencyId: getStoredCurrentAgencyId() ?? '',
        agencyStringMap: agenciesStrMap,
        paymentMethodList: getStoredPaymentMethodList() ?? [],
        busDriverList: busDriverList,
        busDriverStringMap: busdriversStringMap,
        busList: busList,
        busStringMap: busStringMap
    };

    return <EntitiesInfosContext.Provider value={value} >
        {children}
    </EntitiesInfosContext.Provider>
}

export const useEntitiesInfos: () => EntitiesInfosContextType = () => {
    const context = useContext(EntitiesInfosContext);
    if (!context) {
        throw new Error("useEntitiesInfos must be used within EntitiesInfosProvider");
    }
    return context;
}