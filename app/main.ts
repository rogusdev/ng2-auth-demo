import { bootstrap }    from 'angular2/platform/browser';
import { provide } from 'angular2/core';
import { FORM_PROVIDERS } from 'angular2/common';
import { ROUTER_PROVIDERS } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { AppComponent } from './app.component';

// Add all operators to Observable @ "Enable RxJS Operators"
//  https://angular.io/docs/ts/latest/guide/server-communication.html
import 'rxjs/Rx';
// http://stackoverflow.com/questions/34515173/angular-2-http-get-with-typescript-error-http-get-map-is-not-a-function-in
//import 'rxjs/add/operator/map'
//import 'rxjs/add/operator/catch'
//import 'rxjs/add/operator/throw'

bootstrap(AppComponent, [
  FORM_PROVIDERS,
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS
]);
