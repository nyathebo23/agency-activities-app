import dayjs from "dayjs";
import { travelTypes, type Travel } from "../types/models/travel";


export function toTravelString(travel: Travel) {
    return `Travel ${travelTypes[travel.travelType]} depart planned to ${dayjs(travel.plannedDepartDatetime).format('YYYY-MM-DD HH:mm')}`
}

export function toAgencyString(agencyId: string) {
    
}
