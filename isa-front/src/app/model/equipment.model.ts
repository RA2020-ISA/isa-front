import { Company } from "./company.model";

export interface Equipment {
    id?: number,
    name: string,
    description: string, 
    price: number,
    grade: number, 
    type: string, 
    maxQuantity: number,
    company: Company
}
