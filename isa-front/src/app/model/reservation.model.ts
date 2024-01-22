import { Appointment } from "./appointment.model";
import { Item } from "./item.model";
import { ReservationStatus } from "./reservation-status";
import { User } from "./user-model";

export interface Reservation {
    id?: number;
    appointment?: Appointment;
    user?: User;
    items: Item[];
    status?: ReservationStatus;
}