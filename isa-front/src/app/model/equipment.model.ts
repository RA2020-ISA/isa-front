import { Company } from "./company.model";

export interface Equipment {
    id?: number,
    description: string, 
    grade: number, 
    name: string,
    price: number,
    type: string, 
    companies : Company[]
}