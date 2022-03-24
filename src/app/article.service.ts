import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  
  constructor(private http: HttpClient) { }

  getArticles(): Observable<any> {
    return this.http.get(`https://api.marketaux.com/v1/news/all?entity_types=etf,index&api_token=trUAuJexQauhRBKLARofBVuQpML327HZHMb9TaV6&language=en`)
  }
}
