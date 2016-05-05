// primarily adapted from:
//  https://medium.com/@blacksonic86/authentication-in-angular-2-958052c64492#.1cy8jeg76

import { ElementRef, DynamicComponentLoader, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { RouteAuthService } from './route.auth.service';

@Directive({
  // https://github.com/auth0-blog/angular2-authentication-sample/issues/58
  selector: 'auth-router-outlet'
})
export class AuthRouterOutlet extends RouterOutlet {
  private router: Router;

  constructor(
    _elementRef: ElementRef, _loader: DynamicComponentLoader,
    _parentRouter: Router, @Attribute('name') nameAttr: string,
    private routeAuthService: RouteAuthService
  ) {
    super(_elementRef, _loader, _parentRouter, nameAttr);
    this.router = _parentRouter;
  }

  activate(instruction: ComponentInstruction) {
    if (this.routeAuthService.isAllowed(instruction.urlPath)) {
      return super.activate(instruction);
    }

    let queryParams = instruction.urlParams.join('&');
    let goto = queryParams.length > 0
      ? `${instruction.urlPath}?${queryParams}`
      : instruction.urlPath;
    this.router.navigate(['Login', {'goto': encodeURIComponent(goto)}]);
  }
}
