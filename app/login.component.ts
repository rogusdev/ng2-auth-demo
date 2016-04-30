import { Component } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { UserService } from './user.service';

@Component({
  selector: 'login',
  templateUrl: 'app/login.component.html',
})
export class LoginComponent {
  private goto: string;

  constructor(
    private userService: UserService,
    private router: Router,
    routeParams: RouteParams)
  {
    this.goto = routeParams.get('goto');
    console.log(this.goto);
  }

  onSubmit(email, password) {
    this.userService.login(email, password).subscribe(result => {
      if (result) {
        if (!this.goto)
          this.router.navigate(['Profile']);
        else
          this.router.navigateByUrl(decodeURIComponent(this.goto));
      }
    });
  }
}
