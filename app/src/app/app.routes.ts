import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
      { path: '', component: HomeComponent },
      { path: 'user', component: UserComponent},
      {path: 'login', component:LoginComponent},
      {path: 'homepage', component:HomepageComponent}

];
