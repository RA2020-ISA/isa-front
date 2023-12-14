import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';
import { Equipment } from '../model/equipment.model';
import { Router } from '@angular/router';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {
  company?: Company;
  equipments: Equipment[] = [];
  loggedUser?: User;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserStateService) {}

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik:");
      console.log(this.loggedUser);
      this.getAdminCompany();
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  getAdminCompany(): void{
    this.service.getCompanyByAdmin(this.loggedUser?.id || 0).subscribe(
      (company: Company) => {
        this.company = company;
        console.log("Kompanija:");
        console.log(this.company);
        this.service.getEquipmentForCompany(this.company.id || 0).subscribe((equipments: Equipment[]) =>{
          this.equipments = equipments;
          console.log("Opreme:");
          console.log(this.equipments);
        })
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  createAppointment(equipmentId: number): void{
    this.router.navigate(['/appointment-form/' + equipmentId]);
  }
}