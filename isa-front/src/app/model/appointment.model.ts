import { User } from "./user-model";

export interface Appointment {
    id?: number;
    adminId?: number;
    appointmentDate?: Date;
    appointmentTime?: string;
    appointmentDuration?: number;
}