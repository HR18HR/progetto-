import { Component } from '@angular/core';
import { UserComponent } from '../user/user.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { OnInit } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { BackService } from '../back.service';
import { FormsModule, NgModel } from '@angular/forms';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,NgIf,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
email:string="";
password:string="";
risposta:string="";

constructor(public serv:BackService,public rout:Router){}

Login(){
  this.serv.Log_In(this.email,this.password).subscribe({
    next:data=>{this.risposta=data.message
      setTimeout(()=>{
        this.rout.navigate(["/homepage"])
      },2000)
    },
    error:err=>{if(err.status==401)this.risposta="Utente non Autorizzato"
        else this.risposta="Errore riprova più tardi"

    }
  })
}

 
}
