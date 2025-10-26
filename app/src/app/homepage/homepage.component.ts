import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [NgIf],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  lat:any;
  long:any;
  error:any;
  temperatura:number=0;
  tipo:string="";
constructor(public serv:BackService){}

Meteo(lat:number,long:number){
  this.serv.Meteo(lat,long).subscribe({
    next:data=>{
      this.temperatura=<number>data.temperature.degrees;
      this.tipo=<string>data.weatherCondition.description.text;
      this.tipo=this.tipo.toUpperCase();
      console.log(this.tipo)

    },
    error:err=>{

    }
  })
}

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          this.error = null;
        },
        (err) => {
          console.error('Errore geolocalizzazione:', err);
          this.error = 'Impossibile ottenere la posizione. Controlla i permessi GPS.';
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      this.error = 'La geolocalizzazione non è supportata dal browser.';
    }
   
  }
  ngAfterViewInit(){
    this.getLocation();
     setTimeout(()=>{
      this.Meteo(this.lat,this.long)
     },1000)
  }
}
