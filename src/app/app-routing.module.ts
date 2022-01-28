import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { AdvisorComponent } from './advisor/advisor.component';

const routes: Routes = [
  {path:"signup", component:SignupComponent},
  {path:"login", component:LoginComponent},
  {path:"advisor", component:AdvisorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
