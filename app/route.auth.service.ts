import { Injectable } from 'angular2/core';
import { LoginAuthService } from './login.auth.service';


@Injectable()
export class RouteAuthService {
  private publicRoutes: Array<string> = [
    '', 'login', 'register', 'forgot', 'verify', 'video', 'photo'
  ];

  constructor(private loginAuthService: LoginAuthService) {
  }

  isAllowed(url: string) {
    return this.publicRoutes.indexOf(url) !== -1
      || this.loginAuthService.isLoggedIn();
  }
}
