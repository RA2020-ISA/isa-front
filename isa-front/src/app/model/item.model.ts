import { AppointmentReservation } from "./reservation.model";

export interface Item {
    id?: number,
    equipmentId: number;
    equipmentName: string;
    quantity: number;
    reservation?: number;
}