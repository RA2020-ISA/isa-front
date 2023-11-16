export interface User{
    id?: number,
    firstName: string,
    lastName: string,
    email: string, 
    password: string, 
    isLocked: boolean,
    isEnabled: boolean,
}