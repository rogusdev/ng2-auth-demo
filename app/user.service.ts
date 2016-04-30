import { Injectable } from 'angular2/core';
import { Http, Headers, Request } from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

// https://www.thepolyglotdeveloper.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var AWS: any;


@Injectable()
export class UserService {
  private loggedIn = false;
  private identityId = null;
  private devToken = null;

  constructor(private http: Http) {
    //this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(email, password) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // https://angular.io/docs/js/latest/api/http/Http-class.html
    //  using Request object so that I can pass it into aws4 signer, if I choose to go that route (vs api gw genned sdk)
    return this.http.request(new Request({
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ email, password }),
      url: 'https://APIID.execute-api.us-east-1.amazonaws.com/dev/auth/email/login',
    }))
      .map(res => {
        console.log("RESPONSE");
        console.log(res);
        let body = res.json();
        console.log("BODY");
        console.log(body);
        if (body.login) {
          this.identityId = body.identityId;
          this.devToken = body.token;

          console.log('CHRIS: cognito START');
          new AWS.CognitoIdentity({
            region: 'us-east-1',
          }).getCredentialsForIdentity({
            IdentityId: this.identityId,
            Logins: { 'cognito-identity.amazonaws.com': this.devToken }
          }, function(err, cognitoResponse) {
            if (err)
            {
              console.log("COGNITO ERROR");
              console.log(err, err.stack); // an error occurred
              return false;
            }
            else
            {
              console.log("COGNITO RESPONSE");
              console.log(cognitoResponse);

              //localStorage.setItem('auth_token', res.auth_token);
              this.loggedIn = true;

              console.log('CHRIS: cognito END');
              return this.loggedIn;
            }
          });
        }

        // FIXME: we actually need to use a promise or something to wait for cognito to declare login successful!
        this.loggedIn = true;
        return true;
      })
      .catch(err =>
      {
        console.error('ERROR');
        console.error(err);
        return Observable.throw(err);
      });
  }

  logout() {
    this.identityId = null;
    this.devToken = null;
    //localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }
}
