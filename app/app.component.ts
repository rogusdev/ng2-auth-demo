import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { UserService } from './user.service';
import { LoggedInRouterOutlet } from './logged.in.router.outlet';

import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { ProfileComponent } from './profile.component';


@Component({
  selector: 'my-app',
  directives: [
    ROUTER_DIRECTIVES,
    LoggedInRouterOutlet
  ],
  providers: [
    ROUTER_PROVIDERS,
    UserService
  ],
  template: `
    <nav>
      <a [routerLink]="['Home']">Home</a>
      <a [routerLink]="['Profile']">Profile</a>
      <a [routerLink]="['Login']">Login</a>
    </nav>
    <auth-router-outlet></auth-router-outlet>
  `
})
@RouteConfig([
  { path: '/', name: 'Home', component: HomeComponent, useAsDefault: true },
  { path: '/login', name: 'Login', component: LoginComponent },
  { path: '/profile', name: 'Profile', component: ProfileComponent }
])
export class AppComponent { }
