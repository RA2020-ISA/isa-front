import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css']
})
export class CompanyProfileComponent implements OnInit {
  companyId?: number;
  company?: Company;
  companies: Company[] = [];

  constructor(private route: ActivatedRoute, private service: CompanyService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['id']; 
      console.log(this.companyId);
      this.service.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
          console.log("Kompanija:");
          console.log(this.company);
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
}
