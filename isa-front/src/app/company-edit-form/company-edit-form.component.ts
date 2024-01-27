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
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(private route: ActivatedRoute, private service: CompanyService,
    private router: Router,
    public userStateService: UserStateService,
    private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.companyId = +params['id'];
      this.service.getCompany(this.companyId).subscribe(
        (company: Company) => {
          this.company = company;
          this.initMap();
        },
        (error) => {
          console.error('Error fetching company', error);
        }
      );
    });
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
        const searchControl = new (GeoSearchControl as any)({
          provider: new OpenStreetMapProvider(),
          autoCompleteDelay: 300,
          showMarker: true,
          showPopup: false,
          maxMarkers: 1,
          retainZoomLevel: false,
          animateZoom: true,
          searchLabel: 'Enter address...',
        });
  
        this.map?.addControl(searchControl);
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
    if (this.company) {
      this.service.updateCompany(this.company).subscribe(
        (updatedCompany: Company) => {
          console.log('Company updated successfully:', updatedCompany);
          this.snackBar.open('Company updated successfully', 'Close', {
            duration: 3000, // trajanje snackbar-a u milisekundama
            panelClass: ['success-snackbar'] // opcionalna klasa za stilizaciju
          });
          this.router.navigate(['/admin-company']);
        },
        (error) => {
          console.error('Error updating company', error);
        }
      );
    }
  }
}
