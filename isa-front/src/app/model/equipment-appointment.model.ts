export interface EquipmentAppointment {
    id?: number,
    equipmentId: number, 
    adminId: number,
    adminName: string,
    adminSurname: string,
    appointmentDate: Date,
    appointmentTime: string, 
    appointmentDuration: number
}