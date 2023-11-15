import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../company-profile/company.service';

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.css']
})
export class AllCompaniesComponent implements OnInit{
  companies: Company[] = [];

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router){}

  ngOnInit(): void {
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

  navigateToCompanyProfile(id : number): void{
    this.router.navigate(['/company-profile/' + id]);
  }
}
