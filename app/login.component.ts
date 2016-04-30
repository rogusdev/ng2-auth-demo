import { Component } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { UserService } from './user.service';

@Component({
  selector: 'login',
  templateUrl: 'app/login.component.html',
})
export class LoginComponent {
  private goto: string;
  private email: string;
  private password: string;
  private submitted: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    routeParams: RouteParams)
  {
    this.goto = routeParams.get('goto');
  }

  onSubmit() {
    this.submitted = true;
    this.userService.login(this.email, this.password).subscribe(result => {
      if (result) {
        if (!this.goto)
          this.router.navigate(['Profile']);
        else
          this.router.navigateByUrl(decodeURIComponent(this.goto));
      }
    });
  }
}
