import { Component } from 'angular2/core';
import { Router, RouteParams } from 'angular2/router';
import { LoginAuthService } from './login.auth.service';

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
    private loginAuthService: LoginAuthService,
    private router: Router,
    routeParams: RouteParams)
  {
    this.goto = routeParams.get('goto');
    if (this.loginAuthService.isLoggedIn()) this.redirect();
  }

  onSubmit() {
    this.errorMessage = null;
    this.submitted = true;

    this.loginAuthService
      .login(this.email, this.password)
      .subscribe(result => {
        console.log("LOGIN");
        console.log(result);
        if (result) {
          this.redirect();
        }
        else
        {
          this.errorMessage = "Login failed!";
          this.submitted = false;
        }
      }, err => {
        this.submitted = false;
        console.log("LOGIN ERROR");
        console.log(err);
      }, () => {
        console.log("LOGIN COMPLETE");
      });
  }

  private redirect() {
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
}
