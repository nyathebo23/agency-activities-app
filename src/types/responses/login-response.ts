import type { AgencyAgent } from "../models/agency-agent"

export type LoginResponse = {
    agencyAgent: AgencyAgent,
    token: string
}