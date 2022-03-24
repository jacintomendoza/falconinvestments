import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { Stock } from "./stock.model"

const baseURL = "https://vg-express-router.herokuapp.com/api";

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  constructor(private http: HttpClient) { }

  getStocks(): Observable<any> {
    return this.http.get(`${baseURL}/stocks/`);
  }

  getStock(id: number): Observable<any> {
    return this.http.get(`${baseURL}/stocks/${id}`);
  }


  getUserStocks(): Observable<any> {
    return this.http.get(`${baseURL}/userStocks/`).pipe(delay(500));
  }
  
  createUserStock(newStock: Stock): Observable<any>{
    return this.http.post(`${baseURL}/userStocks/new`, newStock);
  }

  
  deleteUserStock(id: number | undefined): Observable<any> {
    return this.http.delete(`${baseURL}/userStocks/delete/${id}`);
  }

  updateUserStock(stock: Stock): Observable<any>{
    return this.http.put(`${baseURL}/userStocks/update/${stock.id}`, stock);
  }
}
