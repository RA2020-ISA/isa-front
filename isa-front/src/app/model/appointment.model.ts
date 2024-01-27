import { User } from "./user-model";
import { AppointmentStatus } from "./appointment-status";

export interface Appointment {
    id?: number;
    adminId?: number;
    appointmentDate?: Date;
    appointmentTime?: string;
    appointmentDuration?: number;
    status: AppointmentStatus;
}