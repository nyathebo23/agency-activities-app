import type { Agency } from "../../types/models/agency"
import type { Bus } from "../../types/models/bus"
import type { BusDriver } from "../../types/models/bus-driver"
import type { PaymentMethod } from "../../types/models/payment-method"

export type EntitiesInfosContextType = {
    currentAgencyId: string,
    agencyList: Agency[],
    agencyStringMap: Map<string, string>,
    busList: Bus[],
    busStringMap: Map<string, string>,
    paymentMethodList: PaymentMethod[],
    paymentMethodStringMap: Map<string, string>,
    busDriverList: BusDriver[],
    busDriverStringMap: Map<string, string>
}