import { Equipment } from "./equipment.model";
export interface Company {
    id?: number,
    name: string, 
    address: string, 
    description: string,
    averageGrade: number,
    adminId: number,
    equipments: Equipment[]
}
