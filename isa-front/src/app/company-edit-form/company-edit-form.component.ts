import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyService } from '../services/company.service';
import { Company } from '../model/company.model';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'esri-leaflet';
import * as esri from 'esri-leaflet';
import 'leaflet-control-geocoder';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { ViewChild } from '@angular/core';
import { UserStateService } from '../services/user-state.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-company-edit-form',
  templateUrl: './company-edit-form.component.html',
  styleUrls: ['./company-edit-form.component.css']
})
export class CompanyEditFormComponent implements OnInit {
  companyId?: number;
  company?: Company;
  map: L.Map | undefined; // mapa
  private tempLatitude: number | null = null;
  private tempLongitude: number | null = null;
  private addressInputControl: L.Control | undefined;
  @ViewChild('addressInput') addressInput: any; // Dodajte ovu liniju
  companyForm: FormGroup; // dodala 

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router,
    public userStateService: UserStateService,
    private toastr: ToastrService, private fb: FormBuilder) 
    {
      this.companyForm = this.fb.group({
        name: ['', Validators.required],
        address: ['', [Validators.required, this.addressFormatValidator]],
        description: [''],
        workTimeBegin: ['', Validators.required],
        workTimeEnd: ['', Validators.required], // dodala
      });
    }



  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.service.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
          this.initMap();
          console.log('KOMPANIJA NA EDITU: '+ this.company);
        },
        (error) => {
          console.error('Error fetching company', error);
        }
      );
    });
  }

  addressFormatValidator(control: any): { [key: string]: boolean } | null {
   // const addressPattern = /^(.*)(,\s*(.*),\s*(.*))?$/; // Adresa ili Adresa, Grad, Drzava
    const addressPattern = /^([a-zA-Z0-9\s]+|([a-zA-Z0-9\s]+(,\s*)?){0,2}[a-zA-Z0-9\s]+)$/;  
    const valid = addressPattern.test(control.value);
    return valid ? null : { 'invalidAddressFormat': true };
  }
  
  private initMap(): void {
    const companyAddress = this.company?.address || 'Default Company Address';
    L.Icon.Default.imagePath = 'assets/images/';
  
    // Poziv Geocoding API-ja da dobijete koordinate za adresu
    this.getGeocodeCoordinates(companyAddress).then(coordinates => {
      if (coordinates) {
        // Postavljanje mape i markera sa dobijenim koordinatama
        const initialCoordinates: [number, number] = [coordinates.lat, coordinates.lng];
        this.map = L.map('map').setView(initialCoordinates, 15);
  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
  
        // Kreiranje markera, ali ga ne dodajemo odmah
        const companyMarker = L.marker([coordinates.lat, coordinates.lng]);
        
        // Dodaj događaj za klik na mapu
        this.map?.on('click', (e: L.LeafletMouseEvent) => {
          const clickedCoordinates = e.latlng;
  
          // Ažuriranje koordinata markera
          companyMarker.setLatLng(clickedCoordinates);
  
          // Ažurirajte adresu u modelu
          if (this.company) {
            this.getReverseGeocodeAddress(clickedCoordinates).then((address: string | null) => {
              if (address && this.company?.address) {
                this.company.address = address;
                console.log('Nova adresa:', this.company.address);
              } else {
                console.error('Adresa nije pronađena.');
              }
            });
          }
        });
  
        // Dodavanje markera na mapu nakon podešavanja događaja
        companyMarker.addTo(this.map);
        
        // Dodajte Leaflet kontrolu za unos adrese
        // const searchControl = new (GeoSearchControl as any)({
        //   provider: new OpenStreetMapProvider(),
        //   autoCompleteDelay: 300,
        //   showMarker: true,
        //   showPopup: false,
        //   maxMarkers: 1,
        //   retainZoomLevel: false,
        //   animateZoom: true,
        //   searchLabel: 'Enter address...'
        // });
  
        // this.map?.addControl(searchControl);
      }
    });
  }

  
  private async getReverseGeocodeAddress(coordinates: L.LatLng): Promise<string | null> {
    // Koristimo Nominatim servis za dobijanje adrese na osnovu koordinata
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinates.lat}&lon=${coordinates.lng}`);
    const data = await response.json();
  
    if (data && data.display_name) {
      return data.display_name;
    }
  
    return null;
  }
  
  
  onAddressChange(newValue: string) {
    console.log('Nova vrednost adrese:', newValue);
  }


  private async getGeocodeCoordinates(address: string): Promise<{ lat: number, lng: number } | null> {
    // Koristimo Nominatim servis za pretragu adrese i dobijanje koordinata
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    console.log('Podaci iz nominate servisa:');
    console.log(data);

    if (data && data.length > 0) {
      const location = data[0];
      return { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
    }

    return null;
  }

  onSubmit() {
    console.log(this.company);
    const workTimeBegin = this.parseTime(this.companyForm.value.workTimeBegin);
    const workTimeEnd = this.parseTime(this.companyForm.value.workTimeEnd);
    console.log('BEGIN',workTimeBegin);
    console.log('END', workTimeEnd);
    if(workTimeBegin && workTimeEnd && workTimeBegin > workTimeEnd){  //ako neko unese end posle begin time
      this.toastr.warning('Work time begin has to be BEFORE end time!');
      return; //ne moze
    }
    if (this.company){
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          console.log('Company updated successfully:', updatedCompany);
          this.toastr.success('Successfully updated company!');
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.log(this.company)
          this.toastr.error('Error updating company!');
          console.error('Error updating company', error);
        }
      );
    }
  }

  // Funkcija za pretvaranje stringa vremena u objekat vremena
  parseTime(timeString: string): Date | null {
    if (!timeString) {
      return null;
    }
  
    const timeParts = timeString.split(':');
    if (timeParts.length !== 2) {
      return null;
    }
  
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
  
    if (isNaN(hours) || isNaN(minutes)) {
      return null;
    }
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
  
}
