import { Component, NgModule, OnInit } from "@angular/core";
import { User } from "../model/user-model";
import { ActivatedRoute, Router } from "@angular/router";
import { UserStateService } from "../services/user-state.service";
import { UserService } from "../services/user.service";
import { CommonModule, DatePipe } from "@angular/common";

@Component({
    selector: 'users-penalty-points',
    templateUrl: './users-penalty-points.component.html',
    standalone: true,  
    imports: [CommonModule],
    styleUrls: ['./users-penalty-points.component.css'],
  })
  export class UsersPenaltyPoints implements OnInit{
  
    user?: User;
    penaltyPoints: number | undefined;
    currentDate: Date | undefined;
    formattedCurrentDate: string | undefined;
    formattedValidUntilDate: string | undefined;
    validUntilDate: Date | undefined;
    
    constructor(
        private route: ActivatedRoute, 
        private userService : UserService,
        private router: Router,
        public userStateService: UserStateService,
        private datePipe: DatePipe) {}
  
    ngOnInit():void{
        this.user = this.userStateService.getLoggedInUser();
        console.log(this.user);

        this.penaltyPoints = this.user?.penaltyPoints;
        if (this.user?.id){
            this.userService.getPenaltyPoints(this.user.id).subscribe(
                (response: number)=> {
                    this.penaltyPoints = response;
                },
                (error) => {
                    error('Greska pri prikazivanju penalty points');
                }
            );
        }
        this.currentDate = new Date();
        this.formattedCurrentDate = this.formatDate(this.currentDate);

        this.calculateValidUntilDate();
    }

    private calculateValidUntilDate() {
        if (this.currentDate) {
            const nextMonth = this.currentDate.getMonth() + 1;
            const nextMonthFirstDay = new Date(this.currentDate.getFullYear(), nextMonth, 1);
            this.validUntilDate = nextMonthFirstDay;
            this.formattedValidUntilDate = this.formatDate(this.validUntilDate);
        }
    }

    private formatDate(date: Date): string {
        return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
    }
}