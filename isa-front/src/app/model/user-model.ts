import { UserRole } from "./user-role-enum";

export interface User{
    id?: number,
    firstName: string,
    lastName: string,
    email: string, 
    password: string, 
    isLocked: boolean,
    isEnabled: boolean,
    userRole: UserRole, 
    penaltyPoints: number
}