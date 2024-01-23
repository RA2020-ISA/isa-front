import { ReservationStatus } from "./reservation-status";

export interface QRCodeInfo {
    status: ReservationStatus | undefined;
    imageUrl: string;
  }