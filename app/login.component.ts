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
  private errorMessage: string;

  constructor(
    private userService: UserService,
    private router: Router,
    routeParams: RouteParams)
  {
    this.goto = routeParams.get('goto');
  }

  onSubmit() {
    this.errorMessage = null;
    this.submitted = true;

    this.userService
      .login(this.email, this.password)
      .subscribe(result => {
        console.log("LOGIN");
        console.log(result);
        if (result) {
          console.log(this.goto);
          if (!this.goto)
          {
            console.log('going to profile');
            this.router.navigate(['Profile']);
          }
          else
          {
            console.log('going to goto');
            this.router.navigateByUrl('/' + decodeURIComponent(this.goto));
          }
        }
        else
        {
          this.errorMessage = "Login failed!";
          this.submitted = false;
        }
      }, err => {
        console.log("LOGIN ERROR");
        console.log(err);
      }, () => {
        console.log("LOGIN COMPLETE");
      });
  }
}
