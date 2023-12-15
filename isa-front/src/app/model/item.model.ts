import { AppointmentReservation } from "./reservation.model";

export interface Item {
    id?: number,
    equipmentId: number;
    quantity: number;
    reservation?: AppointmentReservation;
}