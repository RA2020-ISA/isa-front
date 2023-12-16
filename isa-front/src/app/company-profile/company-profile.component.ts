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

  acquireEquipment() {
    
  }
}
