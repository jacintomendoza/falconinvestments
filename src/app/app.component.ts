import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'falconfrontend';
  showInfo:boolean = true;

  disable_info():void{
    this.showInfo=false;
  }
  enable_info():void{
    this.showInfo=true;
  }
}
