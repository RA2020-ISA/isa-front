import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyEditFormComponent } from './company-edit-form/company-edit-form.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile-edit/editProfile.component';
import { AllEquipmentComponent } from './all-equipment/all-equipment.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';

const routes: Routes = [
  {path:'register', component:RegisterComponent},
  {path:'login', component:LoginComponent},
  {path:'', component:HomeComponent},
  {path:'homepage', component:HomepageComponent},
  {path: 'company-profile/:id', component: CompanyProfileComponent},
  {path: 'company-form', component: CompanyFormComponent},
  {path: 'companies', component: AllCompaniesComponent},
  {path: 'edit-company/:id', component: CompanyEditFormComponent},
  {path: 'profile/:username', component: ProfileComponent},
  {path: 'editProfile/:username', component: EditProfileComponent}, 
  {path: 'all-equipment', component: AllEquipmentComponent }, 
  {path: 'work-calendar', component: WorkCalendarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
