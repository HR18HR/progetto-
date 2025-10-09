import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  stringa:string='NO';
constructor(public serv:BackService){}
Chiama(){
  this.serv.Chiama().subscribe({
    next:data=>this.stringa=data.data,
    error:err=>this.stringa="errore"

    })
}

}
