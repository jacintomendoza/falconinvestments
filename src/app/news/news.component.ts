import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  articles: Article[] = []
  isArticles: boolean = false;
  
  
  constructor(private articleService:ArticleService) { }
  
  ngOnInit(): void {
    this.articleService.getArticles().subscribe((res) => {
      this.articles = res.data
      console.log(res)
      this.isArticles = true;
    })
  }

}
