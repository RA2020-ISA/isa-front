import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CompanyProfileComponent } from './company-profile/company-profile.component';
import { AllCompaniesComponent } from './all-companies/all-companies.component';
import { CompanyFormComponent } from './company-form/company-form.component';
import { CompanyEditFormComponent } from './company-edit-form/company-edit-form.component';
import { ProfileComponent } from './profile/profile.component';
import { EditProfileComponent } from './profile-edit/editProfile.component';
import { MatIconModule } from '@angular/material/icon';
import { AllEquipmentComponent } from './all-equipment/all-equipment.component';
import { AdminCompanyComponent } from './admin-company/admin-company.component';
import { AppointmentFormComponent } from './appointment-form/appointment-form.component';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HomepageComponent,
    CompanyProfileComponent,
    AllCompaniesComponent,
    CompanyFormComponent,
    CompanyEditFormComponent,
    ProfileComponent,
    EditProfileComponent,
    AllEquipmentComponent,
    AdminCompanyComponent,
    AppointmentFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    MatIconModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
