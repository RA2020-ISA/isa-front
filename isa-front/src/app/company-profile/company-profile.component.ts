import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { ItemService } from '../services/item.service';
import { Item } from '../model/item.model';
import { UserStateService } from '../services/user-state.service';
import { ReservationService } from '../services/reservation.service';
import { HttpParams } from '@angular/common/http';
import { AppointmentService } from '../services/appointment.service';
import { Observable, catchError, map } from 'rxjs';
import { Appointment } from '../model/appointment.model';
import { Reservation } from '../model/reservation.model';
import { eq } from '@fullcalendar/core/internal-common';
import * as L from 'leaflet'; // za mapu

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  companyId?: number;
  company?: Company;
  companies: Company[] = [];
  equipments: Equipment[] = [];
  searchName: string = '';
  selectedEquipments: Equipment[] = []
  quantity: number = 1; 
  //availableAppointments: Appointment[]=[];
  selectedAppointment: Appointment | undefined;
  createdItems: Item[] = [];
  reservation: Reservation | undefined;
  resId: number | undefined;
  broj: number=0;
  companyAppointments : Appointment[] = [];
  selectedItems : Item[] = []
  proveraReservation: Reservation | undefined;
  map: L.Map | undefined; // mapa
  
  selectedEquipmentQuantities: Map<Equipment, number> = new Map<Equipment, number>();

  //
  selectedDateStr: string | undefined;
  showDatePicker = false;
  showTimeSlots = false;
  selectedDate: Date | undefined = new Date();
  selectedTimeSlot: string | undefined;
  availableTimeSlots: any[] | undefined; // Ovde bi trebali dodati stvarne vrednosti

  constructor(private route: ActivatedRoute, 
    private service: CompanyService,
    private router: Router,
    private equipmentService: EquipmentService,
    private itemService: ItemService,
    public userStateService: UserStateService,
    private reservationService: ReservationService,
    private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    console.log(this.userStateService.getLoggedInUser());
    this.route.params.subscribe(params => {
      this.companyId = +params['id']; 
      console.log(this.companyId);
      this.service.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
          console.log("Kompanija:");
          console.log(this.company);
          this.service.getEquipmentForCompany(this.companyId || 0).subscribe((equipments: Equipment[]) =>{
            this.equipments = equipments;
            console.log("Opreme:");
            console.log(this.equipments);
          })
          this.initMap();
          this.findAvailableAppointments();
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije', error);
        }
      );
    });
  }

  createReservation() {

    console.log('ULOGOVANI USER:', this.userStateService.getLoggedInUser() )

    const newReservation: Reservation = {
      appointment: this.selectedAppointment,      
      user: this.userStateService.getLoggedInUser(),        
      items: this.selectedItems,
    };

    console.log(this.selectedItems);
    console.log('KORISNIK U NEW RESERVATION: ', newReservation.user);

    this.reservationService.createReservation(newReservation).subscribe(
      response => {
        console.log("Reservation created successfully", response);

        for (const selectedItem of this.selectedItems) {
          console.log('svi selected items: ', this.selectedItems)
          if (selectedItem.id)
          selectedItem.reservation = response;
          console.log('kakav je sad item koji ide na update: ', selectedItem);
          this.itemService.update(selectedItem).subscribe(
              updateResponse => {
                console.log(`Item ${selectedItem.id} updated successfully`, updateResponse);
              },
              updateError => {
                console.error(`Error updating item ${selectedItem.id}`, updateError);
              }
            );
        }
      },
      error => {
        console.error("Error creating reservation", error);
      }
    ); 
  }
  
  
  //////////////////////////////////////
  setExtraAppointment() {
    this.showDatePicker = true;
  }

  loadAvailableTimeSlots() {
    // Provera da li je this.selectedDateStr definisana i nije prazna
    if (this.selectedDateStr && this.selectedDateStr.trim() !== '') {
      this.selectedDate = new Date(this.selectedDateStr);
    } else {
      console.error('Invalid or undefined selectedDateStr');
      return; // Dodajte povratnu vrednost kako biste prekinuli izvršavanje u slučaju greške
    }
  
    // Dodajte ispis za proveru
    console.log('Selected date:', this.selectedDate);
  
    this.availableTimeSlots = this.generateRandomTimeSlots();
    this.showTimeSlots = true;
  }

  getAppointmentsForSelectedDate(): Appointment[] {
    // ...

    // Filtrirajte appointmente za odabrani datum
    const appointmentsForSelectedDate = this.companyAppointments
        .filter(appointment => {
            const appointmentDate = appointment.appointmentDate;

            // Provera da li je appointmentDate definisan i tipa number
            if (typeof appointmentDate !== 'number') {
                console.error('Invalid or undefined appointmentDate.');
                return false;
            }

            // Konvertujte appointmentDate u Date objekat
            const dateObject = new Date(appointmentDate);

            // Provera da li je dateObject validan
            if (isNaN(dateObject.getTime())) {
                console.error('Invalid dateObject for appointmentDate:', appointmentDate);
                return false;
            }

            // Provera da li je this.selectedDate definisan i tipa Date
            if (!this.selectedDate || !(this.selectedDate instanceof Date)) {
                console.error('Invalid or undefined selectedDate.');
                return false;
            }

            // Normalizujte vreme na početak dana za poređenje datuma
            const normalizedDateObject = new Date(dateObject);
            normalizedDateObject.setHours(0, 0, 0, 0);

            const normalizedSelectedDate = new Date(this.selectedDate);
            normalizedSelectedDate.setHours(0, 0, 0, 0);

            return normalizedDateObject.getTime() === normalizedSelectedDate.getTime();
        });

    return appointmentsForSelectedDate;
  }

  
  getAppointmentTimesForSelectedDate(): string[] {
    const appointmentsForSelectedDate = this.getAppointmentsForSelectedDate();
    console.log('Appointments for selected date:', appointmentsForSelectedDate);  
    
    // Koristite map da biste izdvojili samo appointmentTime
    const appointmentTimesForSelectedDate = appointmentsForSelectedDate
      .map(appointment => appointment.appointmentTime)
      .filter(appointmentTime => typeof appointmentTime === 'string') as string[];
  
    return appointmentTimesForSelectedDate;
  }
  
  

  generateRandomTimeSlots(): any[] {
    // LOGIKA ZA PRIKAZ TERMINA U SKLOPU RADNOG VREMENA FIRME (ZA TU FIRMU)
    // I LOGIKA DA SE NE PRIKAZU TERMINI KOJI SU VEC PREDEFINISANI ZA TAJ DATUM

    // Svi mogući vremenski slotovi
    const allTimeSlots = [
      { value: '6', display: '6:00 AM' },
      { value: '7', display: '7:00 AM' },
      { value: '8', display: '8:00 AM' },
      { value: '9', display: '9:00 AM' },
      { value: '10', display: '10:00 AM' },
      { value: '11', display: '11:00 AM' },
      { value: '12', display: '12:00 PM' },
      { value: '13', display: '1:00 PM' },
      { value: '14', display: '2:00 PM' },
      { value: '15', display: '3:00 PM' },
      { value: '16', display: '4:00 PM' },
      { value: '17', display: '5:00 PM' },
      { value: '18', display: '6:00 PM' },
      { value: '19', display: '7:00 PM' },
      { value: '20', display: '8:00 PM' },
      { value: '21', display: '9:00 PM' },

      // Dodajte više termina po potrebi
    ];
  
    // Dobijanje vremenskih slotova za odabrani datum
    const existingAppointmentTimes = this.getAppointmentTimesForSelectedDate();
    console.log('Existing appointment times:', existingAppointmentTimes);
    console.log('All time slots:', allTimeSlots);

    console.log(this.company?.workTimeBegin, this.company?.workTimeEnd);

    // Filtriranje vremenskih slotova kako bismo izbacili one koje već postoje
    const foundSlots = allTimeSlots.filter(timeSlot => {
      console.log('Checking time slot:', timeSlot.value);
    
      // Pretvorba vrednosti u integer
      const slotValueAsInt = parseInt(timeSlot.value, 10);
    
      // Provera postojanja kompanije i validnosti vrednosti radnog vremena
      if (this.company && this.company.workTimeBegin && this.company.workTimeEnd) {
        const workTimeBeginAsInt = parseInt(this.company.workTimeBegin, 10);
        const workTimeEndAsInt = parseInt(this.company.workTimeEnd, 10);
    
        // Provera da li vrednost vremenskog slota ne prelazi radno vreme kompanije
        return (
          !existingAppointmentTimes.includes(timeSlot.value) &&
          slotValueAsInt >= workTimeBeginAsInt &&
          slotValueAsInt < workTimeEndAsInt
        );
      }
    
      return false; // Dodajte ovu liniju kao podrazumevani slučaj ako vrednosti nisu definisane
    });

    console.log('Found slots after filtering:', foundSlots);

    return foundSlots;
  }
  
  
 checkAppointmentAvailability() {
  // Provera da li su odabrani datum i termin
  if (!this.selectedDate || !this.selectedTimeSlot) {
    console.error('Selected date or time slot is undefined or null.');
    alert('Please select a date and time slot before checking availability.');
    return;
  }

  // Dodajte ispis za proveru
  console.log('Selected date:', this.selectedDate);
  console.log('Selected time slot:', this.selectedTimeSlot);

  // Kreiranje objekta appointment
  const appointment = {
    adminId: -1,
    appointmentDate: this.selectedDate,
    appointmentTime: this.selectedTimeSlot,
    appoointmentDuration: 1
  };

  this.selectedAppointment = appointment;

  console.log(this.selectedAppointment);

    //IDE PROVERA ZA ADMINA I DODAVANJE ADMINA 

    // Poziv funkcije na backend-u za proveru dostupnosti i pronalaženje slobodnog admina
    /* this.yourApiService.checkAppointmentAvailability(appointment)
      .subscribe((response) => {
        // Ovde rukujte odgovorom sa servera, možda ažuriranjem UI-a ili prikazivanjem potvrde
      }, (error) => {
        console.error('Error checking appointment availability:', error);
        // Ovde rukujte greškom, prikažite korisniku poruku ili ažurirajte UI
      }); */
  }
  //////////////////////////////////////////////////
  
  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId)
      .subscribe(
        response => {
          console.log(response); // Handle success
        },
        error => {
          console.error(error); // Handle error
        }
      );
  }
  
  findAvailableAppointments() {
    if (this.companyId) {
      this.appointmentService.findCompanyAppointments(this.companyId).subscribe(
        (companyAppointments : Appointment[]) => {
          console.log('Uspesno dobavljeni termini za tu kompaniju')
          this.companyAppointments = companyAppointments;
          console.log(this.companyAppointments);
        },
        (error) => {
          console.error('Error finding company appointments', error);
        }
      );
    }
  }
  

  edit(id: number): void{
    this.router.navigate(['/edit-company/' + id]);
  }

  search() {
    this.equipmentService.searchEquipmentsByName(this.searchName).subscribe(
      (searchResult: Equipment[]) => {
        this.equipments = searchResult;
      },
      (error) => {
        console.log('neuspeh prilikom search-a: ', error);
      }
    );
  }

  showAll(){
    this.searchName = '';

    this.equipmentService.searchEquipmentsByName(this.searchName).subscribe(
      (searchResult: Equipment[]) => {
        this.equipments = searchResult;
      },
      (error) => {
        console.log('neuspeh prilikom search-a: ', error);
      }
    );
  }

  acquireEquipment(selectedEquipment: Equipment) {
      this.selectedEquipments.push(selectedEquipment)
      this.quantity = 1;
  }

  submitQuantity(equipment: Equipment, quantity: number) {
    console.log('equipment::::', equipment);
    console.log(`Quantity for Equipment ID ${equipment}: ${quantity}`);
    this.selectedEquipmentQuantities.set(equipment, quantity);
    console.log(this.selectedEquipmentQuantities);
  
    const newItem: Item = {
      equipment: equipment,
      quantity: quantity,
      reservation: null,
    };

    console.log('new item eq:::', newItem.equipment);

    this.itemService.createItem(newItem).subscribe(
      response => {
        console.log("Item created successfully", response);
        this.selectedItems.push(response);
      },
      error => {
        console.error("Error creating item", error);
      }
    ); 
  }

  // funkcije za mapu - Milica dodala
  private initMap(): void {
    const companyAddress = this.company?.address || 'Default Company Address';
    console.log('adresa u mapi:');
    console.log(companyAddress);
    L.Icon.Default.imagePath = 'assets/images/';

    // Poziv Geocoding API-ja da dobijete koordinate za adresu
    this.getGeocodeCoordinates(companyAddress).then(coordinates => {
      if (coordinates) {
        // Postavljanje mape i markera sa dobijenim koordinatama
        const initialCoordinates: [number, number] = [coordinates.lat, coordinates.lng];
        console.log('koordinate mape:');
        console.log(initialCoordinates);
        this.map = L.map('map').setView(initialCoordinates, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        const companyMarker = L.marker([coordinates.lat, coordinates.lng]).addTo(this.map);
        companyMarker.bindPopup(this.company?.address || 'adresa').openPopup();
      }
    });
  }

  private async getGeocodeCoordinates(address: string): Promise<{ lat: number, lng: number } | null> {
    // Koristimo Nominatim servis za pretragu adrese i dobijanje koordinata
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    console.log('usao je i evo data:');
    console.log(data);
  
    if (data && data.length > 0) {
      const location = data[0];
      return { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
    }
  
    return null;
  }
}