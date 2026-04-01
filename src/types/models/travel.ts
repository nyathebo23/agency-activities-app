export type Travel = {
    id: string;
    departAgencyId: string;
    arrivalAgencyId: string;
    busId: string;
    busDriverId: string;
    plannedDepartDatetime: Date;
    effectiveDepartDatetime?: Date;
    arrivalDatetime?: Date;
    travelType: TravelType;
    travelState: TravelState;
}

export const TravelState = {
    PLANNED: 0,
    LOADING: 1,
    ONGOING: 2,
    END: 3
} as const;

export type TravelState = typeof TravelState[keyof typeof TravelState];

export const TravelType = {
    CLASSIC: 0,
    VIP: 1
} as const;

export type TravelType = typeof TravelType[keyof typeof TravelType];


export const travelTypes = ['CLASSIC', 'VIP'];
export const travelStates = ['Planned', 'Loading', 'Ongoing', 'End'];