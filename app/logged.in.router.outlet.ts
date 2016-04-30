import { ElementRef, DynamicComponentLoader, Directive, Attribute } from 'angular2/core';
import { Router, RouterOutlet, ComponentInstruction } from 'angular2/router';
import { UserService } from './user.service';

@Directive({
  // https://github.com/auth0-blog/angular2-authentication-sample/issues/58
  selector: 'auth-router-outlet'
})
export class LoggedInRouterOutlet extends RouterOutlet {
  publicRoutes: Array<string>;
  private router: Router;

  constructor(
    _elementRef: ElementRef, _loader: DynamicComponentLoader,
    _parentRouter: Router, @Attribute('name') nameAttr: string,
    private userService: UserService
  ) {
    super(_elementRef, _loader, _parentRouter, nameAttr);

    this.router = _parentRouter;
    this.publicRoutes = [
      '', 'login', 'register'
    ];
  }

  activate(instruction: ComponentInstruction) {
    if (this._canActivate(instruction.urlPath)) {
      return super.activate(instruction);
    }

    let goto = instruction.urlParams.join('&');
    if (goto.length > 0)
      goto = `${instruction.urlPath}?${goto}`;
    else
      goto = instruction.urlPath;
    this.router.navigate(['Login', {'goto': encodeURIComponent(goto)}]);
  }

  _canActivate(url) {
    return this.publicRoutes.indexOf(url) !== -1
      || this.userService.isLoggedIn();
  }
}
