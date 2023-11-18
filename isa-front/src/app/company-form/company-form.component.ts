import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { UserService } from '../services/user.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit{
  companyForm: FormGroup;
  chooseUsers: User[] = [];
  selectedUsersId: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CompanyService,
    private router: Router, 
    private userService: UserService
  ) {

    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUsersForCompanyAdmin().subscribe(
      (result: User[]) => {
        this.chooseUsers = result;  
      },
      (error) => {
        console.error('Greška prilikom učitavanja korisnika', error);
      }
    );
  }
  
  toggleUserSelection(userId: number): void {
    if (this.selectedUsersId.includes(userId)) {
      this.selectedUsersId = this.selectedUsersId.filter((selectedUserId) => selectedUserId !== userId);
    } else {
      this.selectedUsersId.push(userId);
    }
  }

  createCompany(): void {
    const companyName = this.companyForm.value.name;
    const companyAddress = this.companyForm.value.address;
    const companyDescription = this.companyForm.value.description;
  
    const newCompany: Company = {
      name: companyName,
      address: companyAddress,
      description: companyDescription,
      averageGrade: 0 //ovo izmeniti
    };
  
    this.service.createCompany(newCompany).subscribe(
      (result: Company) => {
        this.createCompanyAdmins(result.id || 0);
        this.router.navigate(['/companies']);
      },
      (error) => {
        console.error('Greška prilikom kreiranje kompanije', error);
      }
    );
  }

  createCompanyAdmins(companyId: number):void{ 

    this.service.createCompanyAdmins(this.selectedUsersId, companyId).subscribe(
      (response: string) => {
        console.log('Uspešno kreirani administratori kompanije.', response); //provera
      },
      (error) => {
        console.error('Greška prilikom kreiranja administratora kompanije.', error);
      }
    );
  }
  
}
