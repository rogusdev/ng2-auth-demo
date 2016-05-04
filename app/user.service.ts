import { Injectable } from 'angular2/core';
import { Http, Headers, Request, Response } from 'angular2/http';
import { Observable }     from 'rxjs/Observable';

// https://www.thepolyglotdeveloper.com/2016/01/include-external-javascript-libraries-in-an-angular-2-typescript-project/
declare var AWS: any;


@Injectable()
export class UserService {
  private loggedIn = false;
  private identityId = null;
  private devToken = null;
  private cognitoCredentials = null;

  constructor(private http: Http) {
    //this.loggedIn = !!localStorage.getItem('auth_token');
  }

  login(email: string, password: string): Observable<boolean> {
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
      .map((res: Response) => {
        console.log("RESPONSE");
        console.log(res);
        let body = res.json();
        console.log("BODY");
        console.log(body);

        // "this" changes meaning inside the AWS CognitoIdentity handler,
        //  so we need a reference to update loggedIn on the current "this"
        let setCognitoCredentials = cognitoResponse => {
          if (!cognitoResponse || !cognitoResponse.Credentials)
          {
            this.cognitoCredentials = null;
            this.loggedIn = false;
          }
          else
          {
            //localStorage.setItem('auth_token', res.auth_token);
            this.cognitoCredentials = cognitoResponse.Credentials;
            this.loggedIn = !!this.cognitoCredentials;
            console.log(this.cognitoCredentials);
          }
          return this.loggedIn;
        };

        if (body.login) {
          this.identityId = body.identityId;
          this.devToken = body.token;

          // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-create
          // https://www.packtpub.com/books/content/rxjs-observable-promise-users-part-2
          // http://stackoverflow.com/questions/21667824/trying-to-make-my-own-rxjs-observable
          // https://afterecho.uk/blog/turning-a-callback-into-an-rx-observable.html
          // http://reactivex.io/documentation/operators/create.html
          return Observable.create(observer => {
            console.log('COGNITO START');
            console.log(observer);
            console.log(this);
            console.log(this.identityId);
            console.log(this.devToken);

            new AWS.CognitoIdentity({
              region: 'us-east-1',
            }).getCredentialsForIdentity({
              IdentityId: this.identityId,
              Logins: { 'cognito-identity.amazonaws.com': this.devToken }
            }, function(err, cognitoResponse) {
              if (err)
              {
                setCognitoCredentials(false);
                console.log("COGNITO ERROR");
                console.log(err, err.stack); // an error occurred
                observer.error(err);
              }
              else
              {
                console.log("COGNITO RESPONSE");
                console.log(cognitoResponse);
                observer.next(setCognitoCredentials(cognitoResponse));
                observer.complete()
              }
              console.log('COGNITO END');
            });
          });
        }
        else {
          return Observable.of(setCognitoCredentials(false));
        }
      })
      .switch()  // this collapses the nested observable to lookup the cognito data
      .catch((err: any) =>
      {
        console.error('ERROR');
        console.error(err);
        return Observable.throw(err);
      });
  }

  logout() {
    console.log('logged out');
    this.identityId = null;
    this.devToken = null;
    //localStorage.removeItem('auth_token');
    this.loggedIn = false;
  }

  isLoggedIn() {
    console.log('logged in? ' + this.loggedIn);
    return this.loggedIn;
  }
}
