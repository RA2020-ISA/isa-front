import { Item } from "./item.model";
import { User } from "./user-model";

export interface AppointmentReservation {
    id?: number;
    appointmentDate?: Date;
    appointmentTime?: string;
    appointmentDuration?: number;
    user?: User;
    items: Item[];
}