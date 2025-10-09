import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  constructor(public http:HttpClient) { }
  Chiama():Observable<{data:string}>{
    return this.http.get<{data:string}>("http://localhost:3000/get");
  }
}
