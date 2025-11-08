import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [NgIf,FormsModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  lat:number=0;
  long:number=0;
  error:any;
  temperatura:number=0;
  tipo:string="";
  username:string="";
  password:string="";
  elimina:boolean=false;
  risposta:{buona:string,negativa:string}={buona:"",negativa:""};
  change:boolean=false;
constructor(public serv:BackService,public Router:Router){}

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
Elimina(){
this.elimina=!this.elimina;
}
EliminaAccount(){
  this.serv.EliminaAccount(this.username).subscribe({
    next:data=>{
      this.elimina=false;
      this.risposta.buona=data.message;
      setTimeout(()=>{
        this.Router.navigate(["/login"])
      },5000)

    },
    error:err=>{
      this.elimina=false;
      this.risposta.negativa=err.error.message;
    }
  })
}

CambiaPassword(){
  this.serv.ModificaPassowrd(this.username,this.password).subscribe({
    next:data=>{
      this.risposta.buona=data.message;
    },
    error:err=>{
      this.risposta.negativa=err.error.message;
    }
  })
  setTimeout(()=>{
    this.risposta.buona="";
    this.risposta.negativa="";
    this.change=false;
    this.password="";
  },2000)
}


  Change(){
    this.change=!this.change;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
          this.error = null;
          console.log(this.lat,this.long)
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
      this.Meteo(this.lat,this.long);
    },4000);
   console.log(this.username=this.serv.username_1)
     
  }
}
