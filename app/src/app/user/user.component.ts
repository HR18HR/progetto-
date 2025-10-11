import { Component } from '@angular/core';
import { BackService } from '../back.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-user',
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  email:string=" ";
  password:string=" ";
  city:string=" ";
constructor(){}


}
