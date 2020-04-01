import { UsersComponent } from './users/users.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { UserComponent } from './users/user/user.component';
import { StatComponent } from './users/stat/stat.component';


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'users', component: UsersComponent, children: [
    { path: '', component: StatComponent },
    {path: ':id', component: UserComponent}
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
