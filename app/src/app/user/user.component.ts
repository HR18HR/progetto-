import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
declare const google: any;
@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  email:string=" ";
  password:string="";
  city:string=" ";

constructor(public service:BackService){}

Registrazione(){
  this.service.Registrazione(this.email,this.password,this.city).subscribe({
    next:data=>{console.log(data.message)},
      error:err=>console.log(err.error.message)
      
  }) 
}


  ngAfterViewInit(): void {
    const input = document.getElementById('city') as HTMLInputElement;
    if (!input) return;

    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      this.city = place.formatted_address || input.value;
    });
  }
}
