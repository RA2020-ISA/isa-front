import { Equipment } from "./equipment.model";
import { Reservation } from "./reservation.model";

export interface Item {
    id?: number,
    equipment: Equipment;
    quantity: number;
    reservation?: Reservation | null;
}