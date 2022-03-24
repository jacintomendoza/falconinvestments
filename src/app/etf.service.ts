import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtfService {

  constructor(private http: HttpClient) { }

  getEtfs(): Observable<any> {
    return this.http.get("https://db-user-etf.herokuapp.com/etf").pipe(delay(700));
  }
}
