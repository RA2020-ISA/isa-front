import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../company-profile/company.service';
import { Company } from '../model/company.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-edit-form',
  templateUrl: './company-edit-form.component.html',
  styleUrls: ['./company-edit-form.component.css']
})
export class CompanyEditFormComponent implements OnInit {
  companyId?: number;
  company?: Company;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.service.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
        },
        (error) => {
          console.error('Error fetching company', error);
        }
      );
    });
  }

  onSubmit() {
    if (this.company) {
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          console.log('Company updated successfully:', updatedCompany);
          this.router.navigate(['/company-profile/' + updatedCompany.id || 0]);
        },
        (error) => {
          console.error('Error updating company', error);
        }
      );
    }
  }
}
