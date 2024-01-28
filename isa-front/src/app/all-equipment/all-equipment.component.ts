import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from '../model/equipment.model';
import { EquipmentService } from '../services/equipment.service';
import { UserStateService } from '../services/user-state.service';
import { User } from '../model/user-model';

@Component({
  selector: 'app-all-equipment',
  templateUrl: './all-equipment.component.html',
  styleUrls: ['./all-equipment.component.css']
})
export class AllEquipmentComponent implements OnInit{
  equipments: Equipment[] = [];
  searchName: string = '';
  showFilterOptions: boolean = false;
  sortOrderDirection: 'asc' | 'desc' = 'asc';
  sortByRating: boolean = false;
  sortByName: boolean = false;
  sortOrderDirectionName: string = 'asc';
  appliedSort: string = '';
  loggedUser?: User;
  constructor(
    private route: ActivatedRoute,
    private service: EquipmentService,
    private router: Router,
    private userStateService: UserStateService
  ){}

  ngOnInit(): void {
    this.loggedUser = this.userStateService.getLoggedInUser(); 
    if (this.loggedUser && this.loggedUser.id) {
      this.service.getAllEquipments(this.loggedUser.id).subscribe(
        (equipmentsResult: Equipment[]) => {
          this.equipments = equipmentsResult;
          console.log("Oprema sva:");
          console.log(this.equipments);
        },
        (error) => {
          console.error('Greška prilikom dobavljanja sve opreme', error);
        }
      );
    } else {
      console.log('Nije ulogovan nijedan korisnik!');
    }
  }

  search() {
    this.service.searchEquipmentsByName(this.searchName).subscribe(
      (searchResult: Equipment[]) => {
        this.equipments = searchResult;
  
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
      this.equipments.sort((a, b) => a.grade - b.grade);
    }
  }
  
  //for rating
  sortDescending() {
    if (this.sortByRating) {
      this.appliedSort = 'des';
      this.equipments.sort((a, b) => b.grade - a.grade);
    }
  }

  
  showAll(){
    this.searchName = '';
    this.showFilterOptions = false;

    this.sortByRating = false;
    this.appliedSort = '';

    this.service.searchEquipmentsByName(this.searchName).subscribe(
      (searchResult: Equipment[]) => {
        this.equipments = searchResult;
      },
      (error) => {
        console.log('neuspeh prilikom search-a: ', error);
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
    }  
  }

  sortByNameAscending() {
    this.sortOrderDirectionName = 'asc';
    this.sortByName = true;
    this.sortEquipmentsByName();
  }
  
  sortByNameDescending() {
    this.sortOrderDirectionName = 'desc';
    this.sortByName = true;
    this.sortEquipmentsByName();
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
  
  private sortEquipmentsByName() {
    if (this.sortByName) {
      this.equipments.sort((a, b) => {
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
  
}
