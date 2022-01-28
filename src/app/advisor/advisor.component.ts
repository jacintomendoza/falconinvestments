import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../advisor.service';
import { Topic } from './topic.model';

@Component({
  selector: 'app-advisor',
  templateUrl: './advisor.component.html',
  styleUrls: ['./advisor.component.css']
})
export class AdvisorComponent implements OnInit {

  constructor(private advisorService: AdvisorService){}

  topics: Topic[] = [];

  ngOnInit():void {
    this.advisorService.getTopics().subscribe(payload => {
      this.topics = payload;
      console.log(this.topics)
    })
  }

  show_topics():void{
    this.advisorService.getTopics().subscribe(payload => {
      console.log("showing topics...", payload.data)
      this.topics = payload;
    })
  }

}
