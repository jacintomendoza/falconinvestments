import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const URL = "https://falcon-advisor.herokuapp.com/topics"
// const URL = "https://falcon-mutual-funds-service.herokuapp.com/mutual-funds";

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {

  constructor(private http: HttpClient) { }

  getTopics(): Observable<any>{
    const data = this.http.get(`${URL}`);
    return data;
  }
}
