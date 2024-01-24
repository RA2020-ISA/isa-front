import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';
import { EquipmentService } from '../services/equipment.service';
import { ReservationService } from '../services/reservation.service';
import { Location } from '@angular/common';
import { Appointment } from '../model/appointment.model';
import * as L from 'leaflet';
import { Reservation } from '../model/reservation.model';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {
  company?: Company;
  equipments: Equipment[] = [];
  reservations: Reservation[] = [];
  loggedUser?: User;
  showMore: boolean = false;
  moreEquipments?: Equipment[];
  allEquipments?: Equipment[];
  allAppointments?: Appointment[];
  searchName: string = '';
  searchPriceFrom: string = '';
  searchPriceTo: string = '';
  filteredEquipments: Equipment[] = [];
  companyEquipments: Equipment[] = [];
  otherAdministrators: User[] = [];
  map: L.Map | undefined; // mapa

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserStateService, private equipmentService: EquipmentService,
    private reservationService: ReservationService,
    private location: Location) {}

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik je sad:");
      console.log(this.loggedUser);
      this.getAdminCompany();
      this.getAllReservations();
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  getAllReservations(): void{
    this.reservationService.getAllReservations().subscribe(
      (result: Reservation[]) => {
        this.reservations = result;
        console.log("Sve rezervacije:");
        console.log(this.reservations);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih rezervacija', error);
      }
    );
  }

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

  getMoreEquipments(): void{
    this.equipmentService.getEq().subscribe(
      (equipmentsResult: Equipment[]) => {
        this.moreEquipments = equipmentsResult.filter(equipment => 
          !this.company?.equipments?.some(existingEquipment => existingEquipment.id === equipment.id)
        );
  
        console.log("Dodatna oprema:");
        console.log(this.moreEquipments);
        this.getAllAppointments();
      },
      (error) => {
        console.error('Greška prilikom dobavljanja sve opreme', error);
      }
    );
  }

  getAdminCompany(): void{
    this.service.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
        this.companyEquipments = this.company.equipments;
        this.getMoreEquipments();
        this.initMap(); // inicijalizuj mapu
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  removeEquipment(equipment: Equipment): void{
    console.log("Pre brisanja:");
    console.log(this.company);
    
    this.service.removeEqFromCom(this.company?.id || 0, equipment.id || 0).subscribe(
      (updatedCompany: Company) => {
        console.log("Posle brisanja:");
        console.log(updatedCompany);
        const index = this.company?.equipments?.indexOf(equipment);

        if (index !== undefined && this.company?.equipments) {
          this.company.equipments.splice(index, 1);
        }
        this.moreEquipments?.push(equipment);
        this.router.navigate(['/admin-company']);
        this.recalculateAverageGrade();
      },
      (error) => {
        console.error('Error updating company', error);
      }
    );
  }


  refreshPage() {
    window.location.reload();
  }

  addEquipment(equipment: Equipment): void{
    this.service.addEqToCom(this.company?.id || 0, equipment.id || 0).subscribe(
      (updatedCompany: Company) => {
        this.router.navigate(['/admin-company']);
        this.company?.equipments.push(equipment);
        const index = this.moreEquipments?.indexOf(equipment);

        if (index !== undefined && this.moreEquipments) {
          this.moreEquipments.splice(index, 1);
        }
        this.recalculateAverageGrade();
      },
      (error) => {
        console.error('Error updating company', error);
      }
    );
    this.showMore = false;
  }

  recalculateAverageGrade(): void {
    if(this.company){
      if (this.company.equipments.length === 0) {
        // Opciono: Postavi prosečnu ocenu na 0 ili neku podrazumevanu vrednost ako nema opreme.
        this.company.averageGrade = 0;
      } else {
        const totalGrade = this.company.equipments.reduce((sum, equipment) => sum + equipment.grade, 0);
  
        // Izračunaj novu prosečnu ocenu
        const newAverageGrade = totalGrade / this.company.equipments.length;
  
        // Postavi novu prosečnu ocenu u kompaniju
        this.company.averageGrade = newAverageGrade;
      }
    }
  }

  addMoreEquipment(): void{
    this.showMore = true;
  }

  editEquipment(equipmentId: number): void{
    this.router.navigate(['/edit-equipment/' + equipmentId]);
  }

  getAllAppointments(): void{
    this.equipmentService.getAllAppointments().subscribe(
      (result: Appointment[]) => {
        this.allAppointments = result;
  
        console.log("Svi termini za preuzimanje:");
        console.log(this.allAppointments);
        this.getAdministrators();
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih termina za preuzimanje', error);
      }
    );
  }

  getAdministrators(): void{
    console.log('Id kompanije koji se salje u zahtev za admine:');
    console.log(this.company?.id || 0);
    this.service.getAdminsForCompany(this.company?.id || 0).subscribe(
      (result: User[]) => {
        this.otherAdministrators = result;
        this.otherAdministrators = this.otherAdministrators.filter(admin => admin.id !== this.loggedUser?.id);
        console.log("Svi administratori kompanije:");
        console.log(this.otherAdministrators);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih administratora kompanije', error);
      }
    );
  }

  canDelete(equipmentId: number): boolean {
    for (const reservation of this.reservations) {
      for (const item of reservation.items) {
        if (item.equipment?.id === equipmentId) {
          if (reservation.status === 'PENDING') {
            return false;
          }
        }
      }
    }
    return true;
  }

  searchEquipments(): void{
    this.filteredEquipments = [];

    this.filteredEquipments = this.companyEquipments.filter(equipment => 
      (this.searchName === '' || equipment.name.toLowerCase().includes(this.searchName.toLowerCase())) &&
      (this.searchPriceFrom === '' || equipment.price >= (+this.searchPriceFrom || 0)) &&
      (this.searchPriceTo === '' || equipment.price <= +this.searchPriceTo)
    );
    
    console.log("Filtrirane opreme:");
    console.log(this.filteredEquipments);
    this.companyEquipments = this.filteredEquipments;
  }

  showAll(): void{
    this.searchName = '';
    this.searchPriceFrom = '';
    this.searchPriceTo = '';
    this.getAdminCompany();
  }

  seeCompanyCalendarClick(){
    this.router.navigate(['/see-company-calendar']);
  }

  editCompany(): void{
    this.router.navigate(['/edit-company/' + this.company?.id || 0]);
  }
}