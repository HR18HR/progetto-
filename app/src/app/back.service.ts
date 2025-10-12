import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Buffer } from 'Buffer';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  constructor(public http:HttpClient) { }
  

   // Funzione per la registrazione utente normale: invia email, username e password tramite POST
  Registrazione(email: string, password: string,citta:string): Observable<{message:string}> {
    console.log(email,password,citta)
    return this.http.post<{message:string}>("http://localhost:3000/registrazione", { email: email, password: password,citta:citta}, {})
  }


    // Funzione di login: prende username e password, li concatena con ":" e li codifica in base64 per l'autenticazione Basic
  Log_In(username: string, password: string): Observable<{message:string}> {
    const header = new HttpHeaders({
      'Authorization': 'Basic ' + Buffer.from(username.concat(':').concat(password)).toString("base64")
    })
    return this.http.post<{toke:string,message:string}>('http://localhost:3000/login', {}, { headers: header }) // Fa la POST al backend con l'header Authorization
  }

}
