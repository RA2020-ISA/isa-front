import { UserRole } from "./user-role-enum";

export interface User{
    id?: number,
    firstName: string,
    lastName: string,
    email: string, 
    password: string, 
    locked: boolean,
    enabled: boolean,
    userRole: UserRole, 
    penaltyPoints: number,
    city: string, 
    country: string, 
    phoneNumber: string, 
    occupation: string, 
    companyInfo: string, 
    userFirstLogged?: boolean
}