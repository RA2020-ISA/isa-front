import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent {
  companyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private service: CompanyService,
    private router: Router
  ) {

    this.companyForm = this.formBuilder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  createCompany(): void {
    const companyName = this.companyForm.value.name;
    const companyAddress = this.companyForm.value.address;
    const companyDescription = this.companyForm.value.description;
  
    const newCompany: Company = {
      name: companyName,
      address: companyAddress,
      description: companyDescription,
      averageGrade: 0
    };
  
    this.service.createCompany(newCompany).subscribe(
      (result: Company) => {
        this.router.navigate(['/companies']);
      },
      (error) => {
        console.error('Greška prilikom kreiranje kompanije', error);
      }
    );
  }
  
}
