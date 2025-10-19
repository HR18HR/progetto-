import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
declare const google: any;
@Component({
  selector: 'app-user',
  imports: [FormsModule,NgIf],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent {
  email:string=" ";
  password:string="";
  city:string="";
  long:number=0;
  lat:number=0;
  risposta:string="";

constructor(public service:BackService,public route:Router){}

Registrazione(){
  this.service.Registrazione(this.email,this.password,this.city).subscribe({
    next:data=>this.risposta=data.message,
      error:err=>{if(err.status==409)this.risposta="Credenziali già in Uso "
        else this.risposta="Errore Riprova più Tardi";
      }

      
  }) 
  
  setTimeout(()=>{this.route.navigate(["/login"])},2000)
}


initAutocomplete(): void {
  const input = document.getElementById('city') as HTMLInputElement;
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['(cities)'],
    fields: ['name', 'geometry']
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    this.city = place.name;
    this.lat=place.geometry.location.lat()
    this.long=place.geometry.location.lng()
 
  });

}


  ngAfterViewInit():void{
    this.initAutocomplete();

  }
}
