import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { EquipmentService } from '../services/equipment.service';

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
  selectedEquipmentQuantities: Map<number, number> = new Map<number, number>();

  constructor(private route: ActivatedRoute, 
    private service: CompanyService,
    private router: Router,
    private equipmentService: EquipmentService) {}

  ngOnInit(): void {
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