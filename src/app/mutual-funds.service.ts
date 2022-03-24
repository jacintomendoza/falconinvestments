import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { MutualFund } from './mutual-funds/mutual-fund.model';

const URL = "https://falcon-mutual-funds-service.herokuapp.com/mutual-funds";

@Injectable({
  providedIn: 'root'
})
export class MutualFundsService {

  constructor(private http: HttpClient) { }

  getMutualFunds(): Observable<any> {
    return this.http.get(`${URL}`).pipe(delay(700));
  }

  getMutualFund(mf_id: number): Observable<any> {
    return this.http.get(`${URL}/${mf_id}`);
  }

  //untested
  deleteMutualFund(mf_id: number): Observable<any> {
    return this.http.delete(`${URL}/${mf_id}`);
  }

  createMutualFund(newMutualFund: MutualFund): Observable<any>{
    return this.http.post(`${URL}/`, newMutualFund);
  }

  updateMutualFund(mutualFund: MutualFund): Observable<any>{
    return this.http.put(`${URL}/${mutualFund.mf_id}`, mutualFund);
  }
}

