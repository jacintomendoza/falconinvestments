import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = "https://falcon-advisor.herokuapp.com/topics"
const URL_tips = "https://falcon-advisor.herokuapp.com/tips"

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private http: HttpClient) { }

  getTopics(): Observable<any>{
    const data = this.http.get(`${URL}`);
    return data;
  }

  getTips(): Observable<any>{
    const data = this.http.get(`${URL_tips}`);
    return data;
  }
}
