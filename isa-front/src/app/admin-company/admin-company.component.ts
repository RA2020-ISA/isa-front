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
import { EquipmentAppointment } from '../model/equipment-appointment.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-company',
  templateUrl: './admin-company.component.html',
  styleUrls: ['./admin-company.component.css']
})
export class AdminCompanyComponent implements OnInit {
  company?: Company;
  equipments: Equipment[] = [];
  loggedUser?: User;
  showMore: boolean = false;
  moreEquipments?: Equipment[];
  allEquipments?: Equipment[];
  allAppointments?: EquipmentAppointment[];
  searchName: string = '';
  searchPriceFrom: string = '';
  searchPriceTo: string = '';
  filteredEquipments: Equipment[] = [];
  companyEquipments: Equipment[] = [];

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router, private userService: UserStateService, private equipmentService: EquipmentService,
    private location: Location) {}

  ngOnInit(): void {
    this.loggedUser = this.userService.getLoggedInUser();
    if (this.loggedUser) {
      console.log("Ulogovani korisnik je sad:");
      console.log(this.loggedUser);
      this.getAdminCompany();
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
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
      },
      (error) => {
        console.error('Greška prilikom dobavljanja kompanije', error);
      }
    );
  }

  createAppointment(equipmentId: number): void{
    this.router.navigate(['/appointment-form/' + equipmentId]);
  }

  removeEquipment(equipment: Equipment): void{
    /*const index = this.company?.equipments?.indexOf(equipment);

    if (index !== undefined && this.company?.equipments) {
      this.company.equipments.splice(index, 1);
    }

    console.log("apdejtovana kompanija:");
    console.log(this.company);

    if(this.company){
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.error('Error updating company', error);
        }
      );
    }*/
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
    /*this.company?.equipments.push(equipment);
    const index = this.moreEquipments?.indexOf(equipment);

    if (index !== undefined && this.moreEquipments) {
      this.moreEquipments.splice(index, 1);
    }

    if(this.company){
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.error('Error updating company', error);
        }
      );
    }  */

    this.service.addEqToCom(this.company?.id || 0, equipment.id || 0).subscribe(
      (updatedCompany: Company) => {
        this.router.navigate(['/admin-company']);
        this.company?.equipments.push(equipment);
        const index = this.moreEquipments?.indexOf(equipment);

        if (index !== undefined && this.moreEquipments) {
          this.moreEquipments.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error updating company', error);
      }
    );
    this.showMore = false;
  }

  addMoreEquipment(): void{
    this.showMore = true;
  }

  editEquipment(equipmentId: number): void{
    this.router.navigate(['/edit-equipment/' + equipmentId]);
  }

  getAllAppointments(): void{
    this.equipmentService.getAllAppointments().subscribe(
      (result: EquipmentAppointment[]) => {
        this.allAppointments = result;
  
        console.log("Svi termini za preuzimanje:");
        console.log(this.allAppointments);
      },
      (error) => {
        console.error('Greška prilikom dobavljanja svih termina za preuzimanje', error);
      }
    );
  }

  canDelete(id: number): boolean {
    if(this.allAppointments){
      const canDelete = !this.allAppointments.some(appointment => appointment.equipmentId === id);
      return canDelete;
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
}