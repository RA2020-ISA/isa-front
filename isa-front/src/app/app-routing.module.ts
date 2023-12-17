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
import { ReservationsComponent } from './reservations/reservations.component';
import { AdminCompanyComponent } from './admin-company/admin-company.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';
import { WorkCalendarComponent } from './work-calendar/work-calendar.component';
import { EquipmentEditFormComponent } from './equipment-edit-form/equipment-edit-form.component';
import { CompanyCalendarComponent } from './company-calendar/company-calendar.component';
import { ManageAdministratorsComponent } from './manage-administrators/manage-administrators.component';

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
  { path: 'all-equipment', component: AllEquipmentComponent },
  { path: 'reservations/:username', component: ReservationsComponent }, 
  { path: 'admin-company', component: AdminCompanyComponent},
  { path: 'appointment-form/:id/:comid', component: AppointmentFormComponent},
  { path: 'work-calendar', component: WorkCalendarComponent},
  { path: 'edit-equipment/:id', component: EquipmentEditFormComponent},
  { path: 'see-company-calendar', component: CompanyCalendarComponent},
  { path: 'manage-administrators', component: ManageAdministratorsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
