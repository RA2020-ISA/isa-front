import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';
import { Item } from '../model/item.model';
import { UserStateService } from '../services/user-state.service';
import { ReservationService } from '../services/reservation.service';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../model/appointment.model';
import { Reservation } from '../model/reservation.model';
import { User } from '../model/user-model';
import * as L from 'leaflet'; 
import { AppointmentStatus } from '../model/appointment-status';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
})
export class CompanyProfileComponent implements OnInit {

  companyId?: number;
  company?: Company;
  equipments: Equipment[] = [];
  searchName: string = '';
  selectedEquipments: Equipment[] = []
  quantity: number = 1; 
  selectedAppointment: Appointment | undefined;
  companyAppointments : Appointment[] = [];
  selectedItems : Item[] = []
  extraAppointment: boolean | undefined =  false;
  user: User | undefined;
  appointmentSelected: boolean = false;
  isExtraAppointmentButtonVisible: boolean = true;
  isSetExtraAppointmentClicked: boolean = false;
  isSetExtraAppointmentInsteadVisible: boolean = false;
  isSelectExistingDateVisible : boolean = false;

  map: L.Map | undefined; // mapa
  
  selectedDateStr: string | undefined;
  showDatePicker = false;
  showTimeSlots = false;
  selectedDate: Date | undefined = new Date();
  selectedTimeSlot: string | undefined;
  availableTimeSlots: any[] | undefined;

  constructor(private route: ActivatedRoute, 
    private service: CompanyService,
    private router: Router,
    private equipmentService: EquipmentService,
    public userStateService: UserStateService,
    private reservationService: ReservationService,
    private appointmentService: AppointmentService,
    private toastr: ToastrService) {}

  ngOnInit(): void {
    this.user = this.userStateService.getLoggedInUser();
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

  isButtonDisabled(equipment: Equipment): boolean {
    return equipment.maxQuantity === 0;
  }

  createReservation() {
    if (this.user && this.user.penaltyPoints >= 3) {
      this.toastr.error('Unfortunately, you have 3 penalty points and it is not possible to make a reservation.');
    } 
    else {
      if (this.extraAppointment) {
        this.checkAppointmentAvailability()
      }
      else {
        this.createNewReservation();
      }
    }
  }

  updateAppointment(appointment: Appointment): void{
    this.appointmentService.updateAppointment(appointment).subscribe(
      (response: Appointment) => {
        this.selectedAppointment = response;
        console.log('Uspesno update-ovan appointment:');
        console.log(this.selectedAppointment);
      },
      (error: any) => {
        console.error('Greska pri update-ovanju appointmenta!', error);
      });
  }

  createNewReservation() {
    console.log('ULOGOVANI USER:', this.userStateService.getLoggedInUser() )

      const newReservation: Reservation = {
        appointment: this.selectedAppointment,      
        user: this.userStateService.getLoggedInUser(),        
        items: this.selectedItems,
        totalPrice: 0.0
      };
  
      console.log(this.selectedItems);
  
      this.reservationService.createReservation(newReservation).subscribe(
        response => {
          console.log("Reservation created successfully", response);
          this.toastr.success('You have successfully created a reservation. Check your email.');
          this.selectedItems = [];  
          this.selectedEquipments = [];
          this.selectedAppointment = undefined;
          this.isExtraAppointmentButtonVisible = true;
          this.isSetExtraAppointmentInsteadVisible = false;
          this.findAvailableAppointments();
        },
        error => {
          this.toastr.error('Error creating reservation. Please try again.');
          console.error("Error creating reservation", error);
        }
      ); 
  }

  setExtraAppointment() {
    this.showDatePicker = true;
    this.extraAppointment = true;
    console.log('EXTRA APPOINTMENT: ', this.extraAppointment);
    this.isSetExtraAppointmentClicked = true;
    this.isSetExtraAppointmentInsteadVisible = false;
    this.isSelectExistingDateVisible = true;
  }

  loadAvailableTimeSlots() {
    if (this.selectedDateStr && this.selectedDateStr.trim() !== '') {
      this.selectedDate = new Date(this.selectedDateStr);
    } else {
      console.error('Invalid or undefined selectedDateStr');
      return;
    }
  
    console.log('Selected date:', this.selectedDate);
  
    this.availableTimeSlots = this.generateRandomTimeSlots();
    this.showTimeSlots = true;
  }

  getAppointmentsForSelectedDate(): Appointment[] {
    // Filtrirajte appointmente za odabrani datum
    const appointmentsForSelectedDate = this.companyAppointments
        .filter(appointment => {
            const appointmentDate = appointment.appointmentDate;

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
    //console.log('Appointments for selected date:', appointmentsForSelectedDate);  
    
    // Koristite map da biste izdvojili samo appointmentTime
    const appointmentTimesForSelectedDate = appointmentsForSelectedDate
      .map(appointment => appointment.appointmentTime)
      .filter(appointmentTime => typeof appointmentTime === 'string') as string[];
  
    return appointmentTimesForSelectedDate;
  }
  
  minDate(): string {
    const today = new Date();
    
    // Set the minimum date as today's date in the local time zone
    today.setHours(0, 0, 0, 0);
    //console.log(today);
    const minDate = today.toLocaleDateString('en-CA');
    return minDate;
}

  generateRandomTimeSlots(): any[] {
    // LOGIKA ZA PRIKAZ TERMINA U SKLOPU RADNOG VREMENA FIRME (ZA TU FIRMU)
    // I LOGIKA DA SE NE PRIKAZU TERMINI KOJI SU VEC PREDEFINISANI ZA TAJ DATUM

    // Svi mogući vremenski slotovi
    const allTimeSlots = [
      { value: '6', display: '6:00 - 7:00 AM' },
      { value: '7', display: '7:00 - 8:00 AM' },
      { value: '8', display: '8:00 - 9:00 AM' },
      { value: '9', display: '9:00 - 10:00 AM' },
      { value: '10', display: '10:00 - 11:00 AM' },
      { value: '11', display: '11:00 - 12:00 AM' },
      { value: '12', display: '12:00 - 13:00 PM' },
      { value: '13', display: '1:00 - 2:00 PM' },
      { value: '14', display: '2:00 - 3:00 PM' },
      { value: '15', display: '3:00 - 4:00 PM' },
      { value: '16', display: '4:00 - 5:00 PM' },
      { value: '17', display: '5:00 - 6:00 PM' },
      { value: '18', display: '6:00 - 7:00 PM' },
      { value: '19', display: '7:00 - 8:00 PM' },
      { value: '20', display: '8:00 - 9:00 PM' },
      { value: '21', display: '9:00 - 10:00 PM' },
    ];
  
    // Dobijanje vremenskih slotova za odabrani datum
    const existingAppointmentTimes = this.getAppointmentTimesForSelectedDate();

    // Filtriranje vremenskih slotova kako bismo izbacili one koji nisu u okviru radnog vremena
    const foundSlots = allTimeSlots.filter(timeSlot => {

      const slotValueAsInt = parseInt(timeSlot.value, 10);

      if (this.company && this.company.workTimeBegin && this.company.workTimeEnd) {
        const workTimeBeginAsInt = parseInt(this.company.workTimeBegin, 10);
        const workTimeEndAsInt = parseInt(this.company.workTimeEnd, 10);
        
        return (
          slotValueAsInt >= workTimeBeginAsInt &&
          slotValueAsInt < workTimeEndAsInt
        );
      }

      return false; 
    });

    return foundSlots;
  }
  
 checkAppointmentAvailability() {
  console.log('USAO U CHECK APP AVAILABILITY');
  // Provera da li su odabrani datum i termin
  if (!this.selectedDate || !this.selectedTimeSlot) {
    console.error('Selected date or time slot is undefined or null.');
    this.toastr.error('Please select a date and time slot before checking availability.');
    return;
  }

  const appointment = {
    adminId: -1,
    appointmentDate: this.selectedDate,
    appointmentTime: this.selectedTimeSlot+":00",
    appointmentDuration: 60,
    status: AppointmentStatus.RESERVED
  };

  this.selectedAppointment = appointment;

  console.log(this.selectedAppointment);

    //IDE PROVERA ZA ADMINA I DODAVANJE ADMINA 
  if (this.selectedAppointment.id == undefined && this.companyId)
    this.appointmentService.addAdminToAppointment(this.companyId, this.selectedAppointment).subscribe(
      (response: Appointment) => {
        if (response.adminId == -1) {
          this.toastr.error('There is no available admin for this appointment, please choose another one.');
          console.log('ako nije nadjen slobodan: ', this.selectedAppointment);
        }
        else {
          this.selectedAppointment = response;
          console.log('ako je nadjen slobodan: ', this.selectedAppointment);
          this.createNewReservation();
          this.selectedDateStr = undefined;
          this.selectedDate= undefined;
          this.selectedTimeSlot= undefined;
        }
      },
      (error: any) => {
        console.error('greska pri dodavanju slobodnog admina u appointment', error);
      }
    )   
  }
  
  deleteAppointment(appointmentId: number): void {
    this.appointmentService.deleteAppointment(appointmentId)
      .subscribe(
        response => {
          console.log(response); 
        },
        error => {
          console.error(error);
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
      console.log(selectedEquipment)
      this.quantity = 1;
      this.toastr.info('You have successfully added equipment to your cart. Scroll down.');
  }

  submitQuantity(equipment: Equipment, quantity: number) {
    console.log('equipment::::', equipment);
    console.log(`Quantity for Equipment ID ${equipment}: ${quantity}`);

    if (equipment.maxQuantity - quantity < 0) {
        this.toastr.warning('Unfortunately, there is not much equipment available, please try again.');
    }
    else {
      const newItem: Item = {
        equipment: equipment,
        quantity: quantity,
        reservation: null,
      };
  
    console.log('new item eq:::', newItem.equipment);

    this.toastr.success('Quantity submitted successfully');

     this.selectedItems.push(newItem);
    }
  }

  removeEquipmentFromCart(selectedEquipment: Equipment) {
    var indexToRemove = this.selectedEquipments.indexOf(selectedEquipment);
    if (indexToRemove !== -1) {
        this.selectedEquipments.splice(indexToRemove, 1);
    }
    this.toastr.info('You have successfully removed equipment from your cart.');
  }

  //MAPE

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
  onAppointmentChange() {
    // Ako je izabrana opcija, sakrij dugme
    this.isExtraAppointmentButtonVisible = false;
    this.isSetExtraAppointmentInsteadVisible = true;
  }
  setExtraAppointmentInstead(){
    this.extraAppointment = true;
    this.setExtraAppointment();
  }
  setExistingAppointmentInstead(){
    this.extraAppointment =false;
    this.isExtraAppointmentButtonVisible=false;
    this.isSetExtraAppointmentClicked = false;
    this.isSelectExistingDateVisible = false;
    this.showDatePicker = false;
    this.showTimeSlots = false;
    this.isSetExtraAppointmentInsteadVisible = true;
  }
}