import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from 'angular2/router';

import { LoginAuthService } from './login.auth.service';
import { RouteAuthService } from './route.auth.service';
import { AuthRouterOutlet } from './auth.router.outlet';

import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { ProfileComponent } from './profile.component';


@Component({
  selector: 'my-app',
  directives: [
    ROUTER_DIRECTIVES,
    AuthRouterOutlet
  ],
  providers: [
    ROUTER_PROVIDERS,
    LoginAuthService,
    RouteAuthService
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
