import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../advisor.service';
import { Topic } from './topic.model';
import { Tip } from './tip.model';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.scss']
})
export class AdvisorComponent implements OnInit {

  constructor(private advisorService: AdvisorService){}

  topics: Topic[] = [];
  tips: Tip[] = [];

  ngOnInit():void {
    this.advisorService.getTips().subscribe(payload => {
      this.tips = payload;
      console.log(this.tips)
    })
  }
}
