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
import { AppointmentReservation } from '../model/reservation.model';
import { EquipmentAppointment } from '../model/appointment.model';
import { HttpParams } from '@angular/common/http';
import { AppointmentService } from '../services/appointment.service';
import { Observable, catchError, map } from 'rxjs';

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
  availableAppointments: EquipmentAppointment[]=[];
  selectedAppointment: EquipmentAppointment | undefined;
  createdItems: Item[] = [];
  reservation: AppointmentReservation | undefined;
  resId: number | undefined;
  
  selectedEquipmentQuantities: Map<number, number> = new Map<number, number>();

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
        },
        (error) => {
          console.error('Greška prilikom dobavljanja kompanije', error);
        }
      );
    });

    this.getAll();
  }

  getAll(): void{
    this.service.getAllCompanies().subscribe(
      (companies: Company[]) => {
        this.companies = companies;
        console.log("Kompanije:");
        console.log(this.companies);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih kompanija', error);
      }
    );
  }
  createReservations() {
    
  
    // Iterate over selected equipments
    for (const selectedEquipment of this.selectedEquipments) {
      const equipmentId = selectedEquipment.id;
      if (equipmentId == null) {
        return;
      }
  
      const quantity = this.selectedEquipmentQuantities.get(equipmentId) ?? 1;
  
      if (quantity) {
        // Call the createItem method to create an item
        const newItem: Item = {
          // construct the item object as needed
          equipmentId,
          quantity,
          // ... other properties ...
        };
  
        this.itemService.createItem(newItem).subscribe(
          (createdItem: Item) => {
            this.createdItems.push(createdItem);
            console.log(this.createdItems);
            
  
            if (this.createdItems.length === this.selectedEquipments.length) {
              // Save created items and call findAvailable method
              this.findAvailable(this.createdItems);
            }
          },
          (error) => {
            console.error('Error creating item', error);
          }
        );
      }
    }
  }
  findLastId(): Observable<number> {
    return this.reservationService.getAllOrders().pipe(
      map((reservations: AppointmentReservation[]) => {
        const sortedReservations = reservations.sort((a, b) => b.id! - a.id!);
        const lastReservationId = sortedReservations.length > 0 ? sortedReservations[0].id! : 0;
        return sortedReservations.length + 2;
      }),
      catchError((error) => {
        console.error('Error retrieving reservations', error);
        throw error; // Rethrow the error for the calling component to handle
      })
    );
  }
  
  createReservation() {
    // Construct reservation data as needed
    const newReservation: AppointmentReservation = {
      //items: this.createdItems, // Use the items created earlier
      appointmentDate: new Date(),
      appointmentTime: this.selectedAppointment?.appointmentTime, // Replace with actual time
      appointmentDuration: this.selectedAppointment?.appointmentDuration,
      user: this.userStateService.getLoggedInUser(), // Replace with actual duration
    };
  
    console.log('RESERVATION DATE', newReservation.appointmentDate);
    console.log('RESERVATION USER:', newReservation.user);
    console.log('ID:::::',newReservation.id);
  
    //this.findLastId().subscribe(
      //(lastReservationId: number) =>{
       // console.log('Last Reservation ID:', lastReservationId);
        this.reservationService.createReservation(newReservation).subscribe(
          (createdReservation: AppointmentReservation) => {
            console.log('Reservation created:', createdReservation);
            this.reservation=createdReservation;
            console.log(this.reservation);
            this.findLastId();
            console.log('KREIRANI ITEMSI',this.createdItems);
            for (const createdItem of this.createdItems) {
              console.log('ID KREIRANOG ITEMA',createdItem.id);
              console.log('RES',createdReservation.id);
              if(createdItem.id!=null && createdReservation.id!=null){
                this.addReservationToItem(createdItem.id, createdReservation.id);
                console.log('UVEZANO');
              }
              if(createdReservation.user!=null && createdReservation.id){
                this.reservationService.sendReservationQRCode(createdReservation.id, createdReservation.user?.email).subscribe(
                  (qrCodeResult: any) => {
                    console.log('QR Code generated successfully:', qrCodeResult);
                    // Handle success as needed
                  },
                  (error) => {
                    console.error('Error generating QR Code', error);
                    // Handle error as needed
                  }
                );
              }
            }
          this.selectedEquipments = [];
          this.selectedEquipmentQuantities.clear();
          this.selectedAppointment = undefined;

          // Show alert
          alert('Reservation created successfully!');
            
            // Optionally, you can reset the state or perform other actions after reservation creation
          },
          (error) => {
            console.error('Error creating reservation', error);
          }
       );
     // }
    //)
    // Call the createReservation method in your service
    
  }
  addReservationToItem(itemId: number, reservationId: number): void {
    this.reservationService.addReservationToItem(itemId, reservationId)
      .subscribe(
        response => {
          console.log('Reservation added to item successfully:', response);
          // Handle success as needed
        },
        error => {
          console.error('Failed to add reservation to item:', error);
          // Handle error as needed
        }
      );
  }
  findAvailable(items: Item[]) {
    const params = new HttpParams().set('items', JSON.stringify(items));
    this.appointmentService.findAvailable(items).subscribe(
      (availableAppointments: EquipmentAppointment[]) => {
        this.availableAppointments = availableAppointments;
      },
      (error) => {
        console.error('Error finding available appointments', error);
      }
    );
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
     // Ovde možete dodati logiku za dobijanje opreme
        // Na primer, možete proslediti podatke serveru ili ažurirati lokalno stanje

        // Dodajte odabrani equipment u listu sa količinom
        this.selectedEquipments.push(selectedEquipment)
        // Resetujte quantity na 1 za sledeću upotrebu
        this.quantity = 1;

        // Opciono, možete ažurirati logiku za sakrivanje ili uklanjanje dodate opreme
  }

  submitQuantity(equipmentId: number, quantity: number) {
    // Ovde možete dodati logiku za obradu unete količine
    console.log(`Quantity for Equipment ID ${equipmentId}: ${quantity}`);

    // Ažurirajte mapu sa količinom
    this.selectedEquipmentQuantities.set(equipmentId, quantity);

    console.log(this.selectedEquipmentQuantities)
  }
}

//dugme za kreiraj reservaciju  
//prvo kreiras item - i u reservation id mu stavis -1 item pokupi qunatity iz ove mape i eq id
//pozivas item create iz endpointa *controller* 
//kada se kreira rezervacija poziva se endpoint controller - createReservation - ides u service pravis blabla
//u rezervaciji lista itema i ONDA ZAMENIS RESERVATION ID U ITEMU DA BUDE TAJ RESERVATION ID