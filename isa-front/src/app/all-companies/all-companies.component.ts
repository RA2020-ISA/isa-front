import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Company } from '../model/company.model';
import { CompanyService } from '../services/company.service';

@Component({
  selector: 'app-all-companies',
  templateUrl: './all-companies.component.html',
  styleUrls: ['./all-companies.component.css']
})
export class AllCompaniesComponent implements OnInit{
  companies: Company[] = [];
  searchName: string = '';
  searchLocation: string = '';
  showFilterOptions: boolean = false;
  sortOrderDirection: 'asc' | 'desc' = 'asc';
  sortByRating: boolean = false;
  sortByName: boolean = false;
  sortOrderDirectionName: string = 'asc';
  appliedSort: string = '';
  currentIndex: number = 0;
  displayedCompanies: Company[] = [];
  disablePrevButton: boolean = true;
  disableNextButton: boolean = false;

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router){}

  ngOnInit(): void {
    this.service.getAllCompanies().subscribe(
      (companies: Company[]) => {
        this.companies = companies;
        this.updateDisplayedCompanies();
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

  search() {
    this.service.searchCompany(this.searchName, this.searchLocation).subscribe(
      (companies: Company[]) => {
        this.companies = companies;
  
        this.showFilterOptions = true;
      },
      (error) => {
        console.log('neuspeh prilikom search-a: ', error);
      }
    );
  }

  //for rating
  sortAscending() {
    if (this.sortByRating) {
      this.appliedSort = 'asc';
      this.companies.sort((a, b) => a.averageGrade - b.averageGrade);
    }
  }
  
  //for rating
  sortDescending() {
    if (this.sortByRating) {
      this.appliedSort = 'des';
      this.companies.sort((a, b) => b.averageGrade - a.averageGrade);
    }
  }

  showAll(){
    this.searchName = '';
    this.searchLocation = '';

    this.showFilterOptions = false;

    this.sortByRating = false;
    this.appliedSort = '';

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

  resetSorting() {
    this.sortByRating = false;
    this.sortOrderDirection = 'asc';
    this.appliedSort = '';
    if (this.sortByName && this.sortOrderDirectionName === 'asc') {
      this.sortByNameAscending();
    }
    else if (this.sortByRating && this.sortOrderDirectionName === 'des') {
      this.sortByNameDescending();
    }
    else {
      this.search();
    }  }

  sortByNameAscending() {
    this.sortOrderDirectionName = 'asc';
    this.sortByName = true;
    this.sortCompaniesByName();
  }
  
  sortByNameDescending() {
    this.sortOrderDirectionName = 'desc';
    this.sortByName = true;
    this.sortCompaniesByName();
  }
  
  resetSortingByName() {
    this.sortByName = false;
    this.sortOrderDirectionName = 'asc';
    if (this.sortByRating && this.appliedSort === 'asc') {
      this.sortAscending();
    }
    else if (this.sortByRating && this.appliedSort === 'des') {
      this.sortDescending();
    }
    else {
      this.search();
    }
  }
  
  private sortCompaniesByName() {
    if (this.sortByName) {
      this.companies.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
  
        if (this.sortOrderDirectionName === 'asc') {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    }
  }
  onToggleChange() {
    if (!this.showFilterOptions) {
      this.resetSorting();
    }
  }
  // U vašoj TypeScript komponenti
getStarArray(averageGrade: number): number[] {
  return Array(Math.round(averageGrade)).fill(0);
}
updateDisplayedCompanies() {
  this.displayedCompanies = this.companies.slice(this.currentIndex, this.currentIndex + 3);
  this.updateButtonStates();
}

// Dodajte funkcije za listanje kompanija
nextCompany() {
  if (this.currentIndex + 3 < this.companies.length) {
    this.currentIndex++;
    this.updateDisplayedCompanies();
  }
}

prevCompany() {
  if (this.currentIndex > 0) {
    this.currentIndex--;
    this.updateDisplayedCompanies();
  }
}
updateButtonStates() {
  this.disablePrevButton = this.currentIndex === 0;
  this.disableNextButton = this.currentIndex + 3 >= this.companies.length;
}

}
